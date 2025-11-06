import { Totals } from '../types'
import { formatCurrency, formatHours } from '../utils/formatters'

interface SummaryCardsProps {
  totais: Totals
  currency: 'BRL' | 'PYG' | 'USD'
}

export default function SummaryCards({ totais, currency }: SummaryCardsProps) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
            Total Horas Extras
          </h3>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatHours(totais.horasExtras)}
          </p>
          <p className="text-lg text-orange-700 dark:text-orange-300 mt-1">
            {formatCurrency(totais.valorExtra, currency)}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
            Total Horas Noturnas
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatHours(totais.horasNoturnas)}
          </p>
          <p className="text-lg text-purple-700 dark:text-purple-300 mt-1">
            {formatCurrency(totais.valorNoturno, currency)}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Valor Total Geral
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totais.valorTotal, currency)}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            {formatHours(totais.horasTrabalhadas)} trabalhadas
          </p>
        </div>
      </div>
    </div>
  )
}
