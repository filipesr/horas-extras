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
 * Calcula um registro de trabalho completo com a nova lógica
 *
 * Regras:
 * - Segunda a sexta: jornada de 8h, horas além recebem adicional de hora extra (50%)
 * - Sábado: jornada de 6h, horas além recebem adicional de hora extra (50%)
 * - Sábado livre: adicional de 50% sobre TODAS as horas (não é hora extra)
 * - Domingo: adicional de 100% sobre TODAS as horas (não separa hora extra)
 * - Feriado: adicional de 100% sobre TODAS as horas (não separa hora extra)
 * - Noturno a partir das 20h: adicional noturno (20%) sobre horas noturnas
 * - Adicionais de domingo/feriado e noturno são cumulativos
 *
 * IMPORTANTE: Esta função assume que entrada e saída estão no mesmo dia.
 * Para períodos que cruzam meia-noite, use calculateRecordWithDaySplit
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

  // Calcular horas noturnas (a partir das 20h)
  const horasNoturnas = calcularHorasNoturnas(
    entrada,
    saida,
    config.inicioNoturno,
    config.fimNoturno
  )

  // Precisamos separar as horas noturnas entre normais e extras
  // Para simplificar, vamos assumir que o adicional noturno se aplica proporcionalmente
  const horasNoturnasNormais = horasNormais > 0
    ? Math.min(horasNoturnas, horasNormais * (horasNoturnas / horasTrabalhadas))
    : 0
  const horasNoturnasExtras = horasNoturnas - horasNoturnasNormais

  // Calcular valores base
  let valorNormal = 0
  let valorExtra = 0
  let valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
  let valorDomingo = 0
  let valorFeriado = 0

  // Lógica específica por tipo de dia
  if (tipoDia === 'domingo') {
    // Domingo: adicional de 100% sobre TODAS as horas (não separa extra)
    valorDomingo = horasTrabalhadas * valorHora * (config.percentualDomingo / 100)
    valorNormal = horasTrabalhadas * valorHora
    // Não calcula valorExtra para domingo
  } else if (tipoDia === 'feriado') {
    // Feriado: adicional sobre TODAS as horas (não separa extra)
    valorFeriado = horasTrabalhadas * valorHora * (config.percentualFeriado / 100)
    valorNormal = horasTrabalhadas * valorHora
    // Não calcula valorExtra para feriado
  } else if (tipoDia === 'sabado-livre') {
    // Sábado livre: adicional de 50% sobre TODAS as horas (não é hora extra, é adicional fixo)
    valorNormal = horasTrabalhadas * valorHora
    valorExtra = horasTrabalhadas * valorHora * 0.5 // 50% sobre todas as horas
  } else {
    // Seg-Sex e Sábado normal: cálculo tradicional
    valorNormal = horasNormais * valorHora
    valorExtra = horasExtras * valorHora * (1 + config.percentualExtra / 100)
  }

  const valorTotal = valorNormal + valorExtra + valorNoturno + valorDomingo + valorFeriado

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
