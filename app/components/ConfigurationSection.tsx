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
  // Funções auxiliares para converter arrays
  const feriadosString = config.feriados.join(', ')
  const sabadosLivresString = config.sabadosLivres.join(', ')

  const handleFeriadosChange = (value: string) => {
    const feriados = value
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0)
    setConfig({ ...config, feriados })
  }

  const handleSabadosLivresChange = (value: string) => {
    const sabadosLivres = value
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0)
    setConfig({ ...config, sabadosLivres })
  }

  return (
    <div>
      {/* Seção: Salário */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Configurações de Salário
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Moeda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Moeda
            </label>
            <select
              value={config.currency}
              onChange={(e) =>
                setConfig({ ...config, currency: e.target.value as 'BRL' | 'PYG' | 'USD' })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="BRL">BRL (R$)</option>
              <option value="PYG">PYG (₲)</option>
              <option value="USD">USD ($)</option>
            </select>
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
        </div>
      </div>

      {/* Seção: Jornada de Trabalho */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Jornada de Trabalho
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Horas Diárias Seg-Sex */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horas Diárias (Seg-Sex)
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

          {/* Horas Sábado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horas Sábado
            </label>
            <input
              type="number"
              step="0.5"
              value={config.horasSabado}
              onChange={(e) =>
                setConfig({ ...config, horasSabado: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="6"
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
              placeholder="20"
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
      </div>

      {/* Seção: Adicionais */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Adicionais (%)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Percentual Hora Extra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hora Extra
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
              Noturno
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

          {/* Percentual Domingo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domingo
            </label>
            <input
              type="number"
              value={config.percentualDomingo}
              onChange={(e) =>
                setConfig({ ...config, percentualDomingo: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="100"
            />
          </div>

          {/* Percentual Feriado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feriado
            </label>
            <input
              type="number"
              value={config.percentualFeriado}
              onChange={(e) =>
                setConfig({ ...config, percentualFeriado: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="100"
            />
          </div>
        </div>
      </div>

      {/* Seção: Dias Especiais */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Dias Especiais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Feriados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feriados (AAAA-MM-DD, separados por vírgula)
            </label>
            <input
              type="text"
              value={feriadosString}
              onChange={(e) => handleFeriadosChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="2025-01-01, 2025-12-25"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ex: 2025-01-01, 2025-12-25
            </p>
          </div>

          {/* Sábados Livres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sábados Livres (AAAA-MM-DD, separados por vírgula)
            </label>
            <input
              type="text"
              value={sabadosLivresString}
              onChange={(e) => handleSabadosLivresChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="2025-01-04, 2025-01-18"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ex: 2025-01-04, 2025-01-18 (primeiro e terceiro sábado)
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
