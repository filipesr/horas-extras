import { WorkRecord, Totals } from '../types'
import { formatDateTime, formatCurrency, formatHours } from '../utils/formatters'

interface ResultsTableProps {
  records: WorkRecord[]
  totais: Totals
}

export default function ResultsTable({ records, totais }: ResultsTableProps) {
  if (records.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Resultados
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-100 dark:bg-primary-900/30">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Entrada
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Saída
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Horas Totais
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Horas Extras
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Horas Noturnas
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Valor Normal
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Valor Extra
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Valor Noturno
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-primary-300 dark:border-primary-700">
                Valor Total
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
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  {formatDateTime(record.entrada)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  {formatDateTime(record.saida)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  {formatHours(record.horasTrabalhadas)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-orange-600 dark:text-orange-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  {formatHours(record.horasExtras)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-purple-600 dark:text-purple-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  {formatHours(record.horasNoturnas)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  {formatCurrency(record.valorNormal)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-orange-600 dark:text-orange-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  {formatCurrency(record.valorExtra)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-purple-600 dark:text-purple-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  {formatCurrency(record.valorNoturno)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-700">
                  {formatCurrency(record.valorTotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-primary-200 dark:bg-primary-900/40 font-bold">
              <td
                colSpan={2}
                className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 border-t-2 border-primary-400 dark:border-primary-600"
              >
                TOTAIS
              </td>
              <td className="px-4 py-4 text-sm text-right text-gray-800 dark:text-gray-200 border-t-2 border-primary-400 dark:border-primary-600">
                {formatHours(totais.horasTrabalhadas)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-orange-700 dark:text-orange-300 border-t-2 border-primary-400 dark:border-primary-600">
                {formatHours(totais.horasExtras)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-purple-700 dark:text-purple-300 border-t-2 border-primary-400 dark:border-primary-600">
                {formatHours(totais.horasNoturnas)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-gray-800 dark:text-gray-200 border-t-2 border-primary-400 dark:border-primary-600">
                {formatCurrency(totais.valorNormal)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-orange-700 dark:text-orange-300 border-t-2 border-primary-400 dark:border-primary-600">
                {formatCurrency(totais.valorExtra)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-purple-700 dark:text-purple-300 border-t-2 border-primary-400 dark:border-primary-600">
                {formatCurrency(totais.valorNoturno)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-green-700 dark:text-green-300 border-t-2 border-primary-400 dark:border-primary-600">
                {formatCurrency(totais.valorTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
