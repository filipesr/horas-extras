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
  regime: 'Brasil' | 'Paraguay'
  tipoSalario: 'hora' | 'mensal'
  valorSalario: number
  horasMensais: number
  currency: 'BRL' | 'PYG' | 'USD'

  // Percentuais de hora extra
  percentualExtraDiurna: number // Percentual para hora extra diurna
  percentualExtraNoturna: number // Percentual para hora extra noturna
  percentualExtraDomingoFeriado: number // Percentual para hora extra em domingo/feriado

  // Adicional noturno
  percentualNoturno: number
  noturnoSegSex: boolean // Aplicar adicional noturno de seg-sex
  noturnoSabado: boolean // Aplicar adicional noturno no sábado
  noturnoDomingoFeriado: boolean // Aplicar adicional noturno em domingo/feriado

  // Tipo de acumulação
  adicionaisSomados: boolean // true = somados, false = multiplicados em cascata

  // Configurações antigas mantidas para compatibilidade
  percentualExtra: number // Compatibilidade
  percentualDomingo: number // Compatibilidade
  percentualFeriado: number // Compatibilidade

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
