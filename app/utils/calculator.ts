import { WorkRecord, Config } from '../types'

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
 */
export const calculateRecord = (
  entrada: Date,
  saida: Date,
  config: Config,
  somenteExtras: boolean
): WorkRecord => {
  const diffMs = saida.getTime() - entrada.getTime()
  const horasTrabalhadas = diffMs / (1000 * 60 * 60)

  // Calcular valor da hora
  const valorHora =
    config.tipoSalario === 'hora'
      ? config.valorSalario
      : config.valorSalario / config.horasMensais

  // Calcular horas noturnas
  const horasNoturnas = calcularHorasNoturnas(
    entrada,
    saida,
    config.inicioNoturno,
    config.fimNoturno
  )

  // Calcular horas extras (acima da jornada diária)
  let horasExtras = 0
  if (somenteExtras) {
    horasExtras = horasTrabalhadas
  } else {
    horasExtras = Math.max(0, horasTrabalhadas - config.horasDiarias)
  }

  // Calcular valores
  const horasNormais = horasTrabalhadas - horasExtras
  const valorNormal = horasNormais * valorHora
  const valorExtra = horasExtras * valorHora * (1 + config.percentualExtra / 100)
  const valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
  const valorTotal = valorNormal + valorExtra + valorNoturno

  return {
    id: `${entrada.getTime()}-${saida.getTime()}`,
    entrada,
    saida,
    horasTrabalhadas,
    horasExtras,
    horasNoturnas,
    valorNormal,
    valorExtra,
    valorNoturno,
    valorTotal,
  }
}
