export interface WorkRecord {
  id: string
  entrada: Date
  saida: Date
  horasTrabalhadas: number
  horasExtras: number
  horasNoturnas: number
  valorNormal: number
  valorExtra: number
  valorNoturno: number
  valorTotal: number
}

export interface Config {
  tipoSalario: 'hora' | 'mensal'
  valorSalario: number
  horasMensais: number
  percentualExtra: number
  percentualNoturno: number
  horasDiarias: number
  inicioNoturno: number
  fimNoturno: number
}

export interface Totals {
  horasTrabalhadas: number
  horasExtras: number
  horasNoturnas: number
  valorNormal: number
  valorExtra: number
  valorNoturno: number
  valorTotal: number
}
