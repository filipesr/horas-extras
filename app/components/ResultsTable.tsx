import { WorkRecord, Totals, TipoDia } from '../types'
import { formatDateTime, formatCurrency, formatHours } from '../utils/formatters'

interface ResultsTableProps {
  records: WorkRecord[]
  totais: Totals
  currency: 'BRL' | 'PYG' | 'USD'
}

const getTipoDiaLabel = (tipoDia: TipoDia): string => {
  const labels: Record<TipoDia, string> = {
    'seg-sex': 'Seg-Sex',
    'sabado': 'Sábado',
    'sabado-livre': 'Sáb. Livre',
    'domingo': 'Domingo',
    'feriado': 'Feriado',
  }
  return labels[tipoDia]
}

const getTipoDiaColor = (tipoDia: TipoDia): string => {
  const colors: Record<TipoDia, string> = {
    'seg-sex': 'text-gray-700 dark:text-gray-300',
    'sabado': 'text-blue-600 dark:text-blue-400',
    'sabado-livre': 'text-cyan-600 dark:text-cyan-400',
    'domingo': 'text-red-600 dark:text-red-400',
    'feriado': 'text-pink-600 dark:text-pink-400',
  }
  return colors[tipoDia]
}

export default function ResultsTable({ records, totais, currency }: ResultsTableProps) {
  if (records.length === 0) return null

  // Função auxiliar para formatar período de trabalho
  const formatPeriodo = (entrada: Date, saida: Date) => {
    const entradaDate = new Date(entrada)
    const saidaDate = new Date(saida)

    const diaEntrada = entradaDate.getDate()
    const diaSaida = saidaDate.getDate()
    const mesEntrada = entradaDate.getMonth()
    const mesSaida = saidaDate.getMonth()

    const horaEntrada = entradaDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const horaSaida = saidaDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    // Verifica se cruzou dias
    if (diaEntrada !== diaSaida || mesEntrada !== mesSaida) {
      return `de ${diaEntrada}, ${horaEntrada} ao ${diaSaida}, ${horaSaida}`
    } else {
      return `dia ${diaEntrada}, de ${horaEntrada} às ${horaSaida}`
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Resultados
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-primary-100 dark:bg-primary-900/30">
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Período
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Tipo
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                <div className="flex flex-col items-center">
                  <span>Normal</span>
                  <span className="text-[10px] font-normal">horas → valor</span>
                </div>
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                <div className="flex flex-col items-center">
                  <span>Extra</span>
                  <span className="text-[10px] font-normal">horas → valor</span>
                </div>
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                <div className="flex flex-col items-center">
                  <span>Noturno</span>
                  <span className="text-[10px] font-normal">horas → valor</span>
                </div>
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                <div className="flex flex-col items-center">
                  <span>Total</span>
                  <span className="text-[10px] font-normal">valor</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id}
                className={`${
                  index % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                } hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors`}
              >
                <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {formatPeriodo(record.entrada, record.saida)}
                </td>
                <td className={`px-2 py-2 text-xs text-center font-medium border-b border-gray-200 dark:border-gray-700 whitespace-nowrap ${getTipoDiaColor(record.tipoDia)}`}>
                  {getTipoDiaLabel(record.tipoDia)}
                </td>
                <td className="px-2 py-2 text-xs text-center text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {formatHours(record.horasTrabalhadas)} → {formatCurrency(record.valorNormal, currency)}
                </td>
                <td className="px-2 py-2 text-xs text-center text-orange-600 dark:text-orange-400 font-medium border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {record.valorExtra > 0
                    ? `${formatHours(record.horasExtras)} → ${formatCurrency(record.valorExtra, currency)}`
                    : '-'}
                </td>
                <td className="px-2 py-2 text-xs text-center text-purple-600 dark:text-purple-400 font-medium border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {record.horasNoturnas > 0
                    ? `${formatHours(record.horasNoturnas)} → ${formatCurrency(record.valorNoturno, currency)}`
                    : '-'}
                </td>
                <td className="px-2 py-2 text-xs text-center font-semibold text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {formatCurrency(record.valorTotal, currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-primary-200 dark:bg-primary-900/40 font-bold">
              <td
                colSpan={2}
                className="px-2 py-3 text-xs text-gray-800 dark:text-gray-200 border-t-2 border-primary-400 dark:border-primary-600"
              >
                TOTAIS
              </td>
              <td className="px-2 py-3 text-xs text-center text-gray-800 dark:text-gray-200 border-t-2 border-primary-400 dark:border-primary-600 whitespace-nowrap">
                {formatHours(totais.horasTrabalhadas)} → {formatCurrency(totais.valorNormal, currency)}
              </td>
              <td className="px-2 py-3 text-xs text-center text-orange-700 dark:text-orange-300 border-t-2 border-primary-400 dark:border-primary-600 whitespace-nowrap">
                {formatHours(totais.horasExtras)} → {formatCurrency(totais.valorExtra, currency)}
              </td>
              <td className="px-2 py-3 text-xs text-center text-purple-700 dark:text-purple-300 border-t-2 border-primary-400 dark:border-primary-600 whitespace-nowrap">
                {formatHours(totais.horasNoturnas)} → {formatCurrency(totais.valorNoturno, currency)}
              </td>
              <td className="px-2 py-3 text-xs text-center text-green-700 dark:text-green-300 border-t-2 border-primary-400 dark:border-primary-600 whitespace-nowrap">
                {formatCurrency(totais.valorTotal, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
