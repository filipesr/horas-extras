import { Config } from '../types'
import { formatCurrency } from '../utils/formatters'

interface ConfigurationSectionProps {
  config: Config
  setConfig: (config: Config) => void
  valorHora: number
}

export default function ConfigurationSection({
  config,
  setConfig,
  valorHora,
}: ConfigurationSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Configurações
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tipo de Salário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Salário
          </label>
          <select
            value={config.tipoSalario}
            onChange={(e) =>
              setConfig({ ...config, tipoSalario: e.target.value as 'hora' | 'mensal' })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="hora">Por Hora</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        {/* Valor do Salário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor do Salário (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={config.valorSalario}
            onChange={(e) =>
              setConfig({ ...config, valorSalario: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
          />
        </div>

        {/* Horas Mensais */}
        {config.tipoSalario === 'mensal' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horas Mensais
            </label>
            <input
              type="number"
              value={config.horasMensais}
              onChange={(e) =>
                setConfig({ ...config, horasMensais: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="220"
            />
          </div>
        )}

        {/* Horas Diárias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Horas Diárias de Trabalho
          </label>
          <input
            type="number"
            step="0.5"
            value={config.horasDiarias}
            onChange={(e) =>
              setConfig({ ...config, horasDiarias: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="8"
          />
        </div>

        {/* Percentual Hora Extra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adicional Hora Extra (%)
          </label>
          <input
            type="number"
            value={config.percentualExtra}
            onChange={(e) =>
              setConfig({ ...config, percentualExtra: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="50"
          />
        </div>

        {/* Percentual Noturno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adicional Noturno (%)
          </label>
          <input
            type="number"
            value={config.percentualNoturno}
            onChange={(e) =>
              setConfig({ ...config, percentualNoturno: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="20"
          />
        </div>

        {/* Início Horário Noturno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Início Horário Noturno
          </label>
          <input
            type="number"
            min="0"
            max="23"
            value={config.inicioNoturno}
            onChange={(e) =>
              setConfig({ ...config, inicioNoturno: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="22"
          />
        </div>

        {/* Fim Horário Noturno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fim Horário Noturno
          </label>
          <input
            type="number"
            min="0"
            max="23"
            value={config.fimNoturno}
            onChange={(e) =>
              setConfig({ ...config, fimNoturno: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="5"
          />
        </div>
      </div>

      {valorHora > 0 && (
        <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>Valor da hora:</strong> {formatCurrency(valorHora)}
          </p>
        </div>
      )}
    </div>
  )
}
