import { WorkRecord, Config, TipoDia } from '../types'

/**
 * Formata uma data para o formato YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Determina o tipo de dia baseado na data
 */
export const determinarTipoDia = (
  data: Date,
  feriados: string[],
  sabadosLivres: string[]
): TipoDia => {
  const dataStr = formatDate(data)
  const diaSemana = data.getDay() // 0 = domingo, 6 = sábado

  // Verificar se é feriado
  if (feriados.includes(dataStr)) {
    return 'feriado'
  }

  // Verificar se é domingo
  if (diaSemana === 0) {
    return 'domingo'
  }

  // Verificar se é sábado livre
  if (diaSemana === 6 && sabadosLivres.includes(dataStr)) {
    return 'sabado-livre'
  }

  // Verificar se é sábado normal
  if (diaSemana === 6) {
    return 'sabado'
  }

  // Segunda a sexta
  return 'seg-sex'
}

/**
 * Obtém a jornada diária baseada no tipo de dia
 */
const getJornadaDiaria = (tipoDia: TipoDia, config: Config): number => {
  switch (tipoDia) {
    case 'seg-sex':
      return config.horasDiarias // 8h
    case 'sabado':
      return config.horasSabado // 6h
    case 'sabado-livre':
    case 'domingo':
    case 'feriado':
      return 0 // Sem jornada normal, tudo é extra
  }
}

/**
 * Verifica se uma hora está no horário noturno
 */
export const isHorarioNoturno = (
  hora: number,
  inicioNoturno: number,
  fimNoturno: number
): boolean => {
  if (inicioNoturno > fimNoturno) {
    // Ex: 22h às 5h (cruza meia-noite)
    return hora >= inicioNoturno || hora < fimNoturno
  } else {
    // Ex: 0h às 6h
    return hora >= inicioNoturno && hora < fimNoturno
  }
}

/**
 * Calcula as horas noturnas trabalhadas
 */
export const calcularHorasNoturnas = (
  entrada: Date,
  saida: Date,
  inicioNoturno: number,
  fimNoturno: number
): number => {
  let horasNoturnas = 0
  let currentTime = new Date(entrada)

  while (currentTime < saida) {
    const hora = currentTime.getHours() + currentTime.getMinutes() / 60
    if (isHorarioNoturno(Math.floor(hora), inicioNoturno, fimNoturno)) {
      const nextHour = new Date(currentTime.getTime() + 60 * 60 * 1000)
      const endCheck = nextHour < saida ? nextHour : saida
      horasNoturnas += (endCheck.getTime() - currentTime.getTime()) / (1000 * 60 * 60)
      currentTime = nextHour
    } else {
      currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000)
    }
  }

  return horasNoturnas
}

/**
 * Calcula um registro de trabalho completo
 *
 * Regras Brasil:
 * - Segunda a sexta: jornada de 8h, horas além recebem adicional de hora extra (50%)
 * - Sábado: jornada de 4h, horas além recebem adicional de hora extra (50%)
 * - Sábado livre: adicional de 50% sobre TODAS as horas (não é hora extra)
 * - Domingo: adicional de 100% sobre TODAS as horas (não separa hora extra)
 * - Feriado: adicional de 100% sobre TODAS as horas (não separa hora extra)
 * - Noturno a partir das 22h: adicional noturno (30%) sobre horas noturnas
 * - Adicionais de domingo/feriado e noturno são cumulativos
 *
 * Regras Paraguay:
 * - Segunda a sábado: jornada de 8h (seg-sex) ou 4h (sáb)
 * - Hora extra diurna (seg-sáb): +50% (1,5x)
 * - Hora ordinária noturna (seg-sáb): +30% (1,3x)
 * - Hora extra noturna (seg-sáb): +100% sobre hora noturna (2,6x hora diurna)
 * - Qualquer hora em domingo/feriado: +100% (2x), NÃO acumula com extra ou noturno
 *
 * IMPORTANTE: Esta função assume que entrada e saída estão no mesmo dia.
 * Para períodos que cruzam meia-noite, use calculateRecord
 */
const calculateSingleDayRecord = (
  entrada: Date,
  saida: Date,
  config: Config,
  somenteExtras: boolean
): WorkRecord => {
  const diffMs = saida.getTime() - entrada.getTime()
  const horasTrabalhadas = diffMs / (1000 * 60 * 60)

  // Calcular valor da hora base
  const valorHora =
    config.tipoSalario === 'hora'
      ? config.valorSalario
      : config.valorSalario / config.horasMensais

  // Determinar tipo de dia
  const tipoDia = determinarTipoDia(entrada, config.feriados, config.sabadosLivres)

  // Determinar jornada do dia
  const jornadaDiaria = somenteExtras ? 0 : getJornadaDiaria(tipoDia, config)

  // Calcular horas normais e extras
  const horasExtras = Math.max(0, horasTrabalhadas - jornadaDiaria)
  const horasNormais = horasTrabalhadas - horasExtras

  // Calcular horas noturnas
  const horasNoturnas = calcularHorasNoturnas(
    entrada,
    saida,
    config.inicioNoturno,
    config.fimNoturno
  )

  // Precisamos separar as horas noturnas entre normais e extras
  const horasNoturnasNormais = horasNormais > 0
    ? Math.min(horasNoturnas, horasNormais * (horasNoturnas / horasTrabalhadas))
    : 0
  const horasNoturnasExtras = horasNoturnas - horasNoturnasNormais

  // Calcular valores base
  let valorNormal = 0
  let valorExtra = 0
  let valorNoturno = 0
  let valorDomingo = 0
  let valorFeriado = 0

  // REGIME PARAGUAIO
  if (config.regime === 'Paraguay') {
    if (tipoDia === 'domingo' || tipoDia === 'feriado') {
      // Paraguay: Em domingo/feriado, adicional de 100% sobre hora normal
      // NÃO acumula com noturno
      valorNormal = horasTrabalhadas * valorHora
      valorExtra = horasTrabalhadas * valorHora * (config.percentualDomingo / 100)

      if (tipoDia === 'domingo') {
        valorDomingo = valorExtra
      } else {
        valorFeriado = valorExtra
      }
    } else if (tipoDia === 'sabado-livre') {
      // Sábado livre: adicional de 50% sobre TODAS as horas
      valorNormal = horasTrabalhadas * valorHora
      valorExtra = horasTrabalhadas * valorHora * 0.5
    } else {
      // Segunda a sábado: aplica regras de extra e noturno

      // Horas diurnas normais
      const horasDiurnasNormais = horasNormais - horasNoturnasNormais
      valorNormal = horasDiurnasNormais * valorHora

      // Horas noturnas normais: valor normal + 30%
      const valorHorasNoturnasNormais = horasNoturnasNormais * valorHora
      valorNormal += valorHorasNoturnasNormais
      valorNoturno = valorHorasNoturnasNormais * (config.percentualNoturno / 100)

      // Horas extras diurnas: 1.5x
      const horasDiurnasExtras = horasExtras - horasNoturnasExtras
      valorExtra = horasDiurnasExtras * valorHora * (1 + config.percentualExtra / 100)

      // Horas extras noturnas: 2.6x hora diurna
      // (1.3x base noturna + 100% de extra sobre base noturna = 2.6x base diurna)
      const valorHorasNoturnasExtras = horasNoturnasExtras * valorHora
      valorExtra += valorHorasNoturnasExtras * (1 + config.percentualExtra / 100)
      valorNoturno += valorHorasNoturnasExtras * (config.percentualNoturno / 100)
    }
  }
  // REGIME BRASILEIRO
  else {
    if (tipoDia === 'domingo') {
      // Brasil: Domingo - valor normal + adicional de 100% vai para "Extra"
      // ACUMULA com noturno
      valorNormal = horasTrabalhadas * valorHora
      valorExtra = horasTrabalhadas * valorHora * (config.percentualDomingo / 100)
      valorDomingo = valorExtra
      valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
    } else if (tipoDia === 'feriado') {
      // Brasil: Feriado - valor normal + adicional de 100% vai para "Extra"
      // ACUMULA com noturno
      valorNormal = horasTrabalhadas * valorHora
      valorExtra = horasTrabalhadas * valorHora * (config.percentualFeriado / 100)
      valorFeriado = valorExtra
      valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
    } else if (tipoDia === 'sabado-livre') {
      // Brasil: Sábado livre - adicional de 50% sobre TODAS as horas
      valorNormal = horasTrabalhadas * valorHora
      valorExtra = horasTrabalhadas * valorHora * 0.5
      valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
    } else {
      // Brasil: Seg-Sex e Sábado normal - cálculo tradicional
      valorNormal = horasNormais * valorHora
      valorExtra = horasExtras * valorHora * (1 + config.percentualExtra / 100)
      valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
    }
  }

  const valorTotal = valorNormal + valorExtra + valorNoturno

  return {
    id: `${entrada.getTime()}-${saida.getTime()}`,
    entrada,
    saida,
    tipoDia,
    horasTrabalhadas,
    horasExtras,
    horasNoturnas,
    valorNormal,
    valorExtra,
    valorNoturno,
    valorDomingo,
    valorFeriado,
    valorTotal,
  }
}

/**
 * Divide um período de trabalho que cruza meia-noite em múltiplos registros,
 * um para cada dia, aplicando as regras específicas de cada dia.
 *
 * Exemplo: Sábado 22h até Domingo 02h
 * - Divide em: Sábado 22h-00h e Domingo 00h-02h
 * - Aplica regras de sábado (extra 50%) no primeiro período
 * - Aplica regras de domingo (100%) no segundo período
 */
export const calculateRecord = (
  entrada: Date,
  saida: Date,
  config: Config,
  somenteExtras: boolean
): WorkRecord | WorkRecord[] => {
  // Verificar se cruza meia-noite
  const entradaDate = new Date(entrada)
  const saidaDate = new Date(saida)

  const entradaDay = new Date(entradaDate.getFullYear(), entradaDate.getMonth(), entradaDate.getDate())
  const saidaDay = new Date(saidaDate.getFullYear(), saidaDate.getMonth(), saidaDate.getDate())

  // Se não cruza dia, calcula normalmente
  if (entradaDay.getTime() === saidaDay.getTime()) {
    return calculateSingleDayRecord(entrada, saida, config, somenteExtras)
  }

  // Se cruza um ou mais dias, divide em períodos
  const records: WorkRecord[] = []
  let currentStart = new Date(entrada)

  while (currentStart < saida) {
    // Calcular meia-noite do próximo dia
    const currentDay = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate())
    const nextMidnight = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000)

    // Determinar fim do período atual
    const currentEnd = nextMidnight < saida ? nextMidnight : saida

    // Calcular registro para este período
    const record = calculateSingleDayRecord(currentStart, currentEnd, config, somenteExtras)
    records.push(record)

    // Avançar para o próximo período
    currentStart = nextMidnight
  }

  // Se houver múltiplos registros, retornar array
  // Se houver apenas um (não deveria acontecer por causa da verificação acima), retornar único
  return records.length === 1 ? records[0] : records
}
