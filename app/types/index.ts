export type TipoDia = 'seg-sex' | 'sabado' | 'sabado-livre' | 'domingo' | 'feriado'

export interface WorkRecord {
  id: string
  entrada: Date
  saida: Date
  tipoDia: TipoDia
  horasTrabalhadas: number
  horasExtras: number
  horasNoturnas: number
  valorNormal: number
  valorExtra: number
  valorNoturno: number
  valorDomingo: number
  valorFeriado: number
  valorTotal: number
}

export interface Config {
  tipoSalario: 'hora' | 'mensal'
  valorSalario: number
  horasMensais: number
  currency: 'BRL' | 'PYG' | 'USD'
  percentualExtra: number
  percentualNoturno: number
  percentualDomingo: number
  percentualFeriado: number
  horasDiarias: number
  horasSabado: number
  inicioNoturno: number
  fimNoturno: number
  feriados: string[] // Array de datas no formato YYYY-MM-DD
  sabadosLivres: string[] // Array de datas no formato YYYY-MM-DD
}

export interface Totals {
  horasTrabalhadas: number
  horasExtras: number
  horasNoturnas: number
  valorNormal: number
  valorExtra: number
  valorNoturno: number
  valorDomingo: number
  valorFeriado: number
  valorTotal: number
}
