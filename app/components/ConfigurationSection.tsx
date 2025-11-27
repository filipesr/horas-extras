import { Config } from '../types'
import { formatCurrency } from '../utils/formatters'
import { useState } from 'react'

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
    const [showHintCountry, setShowHintCountry] = useState(false)
    const [showHintMonthlyHour, setShowHintMonthlyHour] = useState(false)
  
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

  const handleRegimeChange = (newRegime: 'Brasil' | 'Paraguay') => {
    // Valores padrão para cada regime
    if (newRegime === 'Paraguay') {
      setConfig({
        ...config,
        regime: newRegime,
        horasMensais: 208,

        // Percentuais de hora extra
        percentualExtraDiurna: 50,
        percentualExtraNoturna: 100, // 100% sobre a hora noturna base
        percentualExtraDomingoFeriado: 100,

        // Adicional noturno
        percentualNoturno: 30,
        noturnoSegSex: true,
        noturnoSabado: true,
        noturnoDomingoFeriado: true, // Paraguay NÃO acumula

        // Tipo de acumulação
        adicionaisSomados: false,

        // Compatibilidade
        percentualExtra: 50,

        horasDiarias: 8,
        horasSabado: 5,
        inicioNoturno: 20,
        fimNoturno: 6,
      })
    } else {
      setConfig({
        ...config,
        regime: newRegime,
        horasMensais: 220,

        // Percentuais de hora extra
        percentualExtraDiurna: 50,
        percentualExtraNoturna: 50,
        percentualExtraDomingoFeriado: 100,

        // Adicional noturno
        percentualNoturno: 30,
        noturnoSegSex: true,
        noturnoSabado: true,
        noturnoDomingoFeriado: true, // Brasil acumula noturno em domingo/feriado

        // Tipo de acumulação
        adicionaisSomados: true,

        // Compatibilidade
        percentualExtra: 50,

        horasDiarias: 8,
        horasSabado: 4,
        inicioNoturno: 22,
        fimNoturno: 5,
      })
    }
  }

  return (
    <div>
      {/* Seção: Salário */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Configurações de Salário
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Regime */}
          <div>
            <div className="flex justify-between text-sm font-medium">
              <label className=" text-gray-700 dark:text-gray-300">
                Regime
              </label>
              {/* Botão de Ajuda */}
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowHintCountry(true)}
                  onMouseLeave={() => setShowHintCountry(false)}
                  onClick={() => setShowHintCountry(!showHintCountry)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
                  aria-label="Ajuda sobre formatos aceitos"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Popover com informações sobre regimes */}
                {showHintCountry && (
                  <div className="absolute -right-80 top-full mt-2 w-[45rem] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Regimes de Cálculo de Horas Extras
                    </h3>

                    <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
                      Brasil (CLT)
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Dias úteis (Segunda a Sábado):</strong>
                      <ul className="pl-4 my-1 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                        <li>Jornada normal: 8h (seg-sex) e 4h (sábado)</li>
                        <li>Hora extra: +50% sobre o valor da hora normal</li>
                        <li>Adicional noturno (22h-5h): +30% sobre horas noturnas</li>
                        <li>Hora extra noturna: adicional de 50% + adicional de 30% (acumulam)</li>
                      </ul>

                      <strong className="block mt-2">Domingos e Feriados:</strong>
                      <ul className="pl-4 my-1 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                        <li>Adicional de +100% sobre TODAS as horas trabalhadas</li>
                        <li>Adicional noturno (+30%) ACUMULA com o adicional de domingo/feriado</li>
                        <li>Exemplo: hora noturna em domingo = hora base + 100% (domingo) + 30% (noturno)</li>
                      </ul>
                    </p>

                    <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2 mt-3">
                      Paraguay (Lei Nº 213/93)
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Dias úteis (Segunda a Sábado):</strong>
                      <ul className="pl-4 my-1 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                        <li>Jornada normal: 8h (seg-sex) e 5h (sábado)</li>
                        <li>Hora extra diurna: +50% (= 1,5x o valor da hora base)</li>
                        <li>Hora ordinária noturna (20h-6h): +30% (= 1,3x o valor da hora base)</li>
                        <li>Hora extra noturna: hora base + 30% (noturno) + 100% sobre a hora noturna (= 2,6x hora base)</li>
                      </ul>

                      <strong className="block mt-2">Domingos e Feriados:</strong>
                      <ul className="pl-4 my-1 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                        <li>Adicional de +100% sobre TODAS as horas trabalhadas</li>
                        <li>Adicional noturno NÃO acumula em domingos/feriados</li>
                        <li>Todas as horas são pagas como: hora base + 100% (domingo/feriado)</li>
                        <li>Exemplo: hora noturna em domingo = apenas hora base + 100% (sem adicional noturno)</li>
                      </ul>
                    </p>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        <strong>Diferença principal:</strong> No Brasil, adicionais de domingo/feriado e noturno acumulam.
                        No Paraguay, em domingos e feriados aplica-se apenas o adicional de 100%, sem acumular com o noturno.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <select
              value={config.regime}
              onChange={(e) => handleRegimeChange(e.target.value as 'Brasil' | 'Paraguay')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="Brasil">Brasil</option>
              <option value="Paraguay">Paraguay</option>
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
              <div className="flex justify-between text-sm font-medium">
                <label className=" text-gray-700 dark:text-gray-300">
                  Horas Mensais
                </label>
                {/* Botão de Ajuda */}
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowHintMonthlyHour(true)}
                    onMouseLeave={() => setShowHintMonthlyHour(false)}
                    onClick={() => setShowHintMonthlyHour(!showHintMonthlyHour)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
                    aria-label="Ajuda sobre formatos aceitos"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Popover com formatos aceitos */}
                  {showHintMonthlyHour && (
                    <div className="absolute right-0 top-full mt-2 w-[40rem] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Cálculo base de horas extras:
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        O cálculo das horas mensais toma como base um mês de 30 dias, ou seja:
                        <ul className="pl-2 my-2 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                          <li>4.25 semanas</li>
                        </ul>
                      </p>
                      <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
                        Funcionários: 188 horas mensais
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Considera um sábado livre e um sábado de plantão. Então:
                        <ul className="pl-2 my-2 text-xs text-gray-500 dark:text-gray-500 list-inside">
                          <li className='list-disc '>8 horas diárias de segunda a sexta = 40 horas semanais</li>
                          <li className='pl-4'> + 5 horas no sábado normal = 45 horas semanais ou</li>
                          <li className='pl-4'> + 7 horas no sábado de plantão = 47 horas semanais ou</li>
                          <li className='pl-4'> + 0 horas no sábado livre = 40 horas semanais</li>
                        </ul>

                        Portanto, para calcular as horas mensais:
                        <ul className="pl-2 mb-2 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                          <li>Com sábado normal: 45 horas semanais x 2.25 semanas = 101 horas</li>
                          <li>Com sábado de plantão: 47 horas semanais x 1 semana = 47 horas</li>
                          <li>Com sábado livre: 40 horas semanais = 40 horas</li>
                        </ul>

                        Totalizando:
                        <ul className="pl-2 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                          <li>101 + 47  + 40 = 188 horas mensais para o funcionário</li>
                        </ul>

                      </p>
                      <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
                        Estagiário: 85 horas mensais
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Considera que o estagiário trabalha de segunda a sexta-feira, sem sábado. Então:
                        <ul className="pl-2 my-2 text-xs text-gray-500 dark:text-gray-500 list-inside">
                          <li className='list-disc '>4 horas diárias de segunda a sexta = 20 horas semanais</li>
                        </ul>

                        Portanto, para calcular as horas mensais:
                        <ul className="pl-2 mb-2 text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                          <li>Com sábado normal: 20 horas semanais x 4.25 semanas = 85 horas mensais</li>
                        </ul>
                      </p>
                    </div>
                  )}
                </div>
              </div>
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

      {/* Seção: Configurações Avançadas de Horas Extras */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
          Configurações Avançadas de Horas Extras
        </h3>

        {/* Percentuais de Hora Extra */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
            Percentuais de Hora Extra (%)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hora Extra Diurna */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-1">
                  Hora Extra Diurna
                  <span className="text-xs text-gray-500" title="Adicional aplicado sobre horas extras trabalhadas em horário diurno">ℹ️</span>
                </span>
              </label>
              <input
                type="number"
                value={config.percentualExtraDiurna}
                onChange={(e) =>
                  setConfig({ ...config, percentualExtraDiurna: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="50"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ex: 50% = 1,5x hora base
              </p>
            </div>

            {/* Hora Extra Noturna */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-1">
                  Hora Extra Noturna
                  <span className="text-xs text-gray-500" title="Adicional aplicado sobre horas extras trabalhadas em horário noturno">ℹ️</span>
                </span>
              </label>
              <input
                type="number"
                value={config.percentualExtraNoturna}
                onChange={(e) =>
                  setConfig({ ...config, percentualExtraNoturna: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="50"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ex: 50% ou 100% sobre hora noturna
              </p>
            </div>

            {/* Hora Extra Domingo/Feriado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-1">
                  Domingo/Feriado
                  <span className="text-xs text-gray-500" title="Adicional aplicado sobre horas trabalhadas em domingos e feriados">ℹ️</span>
                </span>
              </label>
              <input
                type="number"
                value={config.percentualExtraDomingoFeriado}
                onChange={(e) =>
                  setConfig({ ...config, percentualExtraDomingoFeriado: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ex: 100% = 2x hora base
              </p>
            </div>
          </div>
        </div>

        {/* Aplicar Adicional Noturno */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400 flex items-center gap-1">
            Aplicar Adicional Noturno
            <span className="text-xs text-gray-500 font-normal" title="Define em quais dias o adicional noturno será aplicado">ℹ️</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Percentual Noturno */}
            <div>
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
            {/* Noturno Seg-Sex */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="noturnoSegSex"
                checked={config.noturnoSegSex}
                onChange={(e) =>
                  setConfig({ ...config, noturnoSegSex: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="noturnoSegSex" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Segunda a Sexta
              </label>
            </div>

            {/* Noturno Sábado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="noturnoSabado"
                checked={config.noturnoSabado}
                onChange={(e) =>
                  setConfig({ ...config, noturnoSabado: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="noturnoSabado" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sábado
              </label>
            </div>

            {/* Noturno Domingo/Feriado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="noturnoDomingoFeriado"
                checked={config.noturnoDomingoFeriado}
                onChange={(e) =>
                  setConfig({ ...config, noturnoDomingoFeriado: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="noturnoDomingoFeriado" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Domingo/Feriado
              </label>
            </div>
          </div>
        </div>

        {/* Tipo de Acumulação */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400 flex items-center gap-1">
            Tipo de Acumulação de Adicionais
            <span className="text-xs text-gray-500 font-normal" title="Define como os adicionais (extra + noturno) são calculados">ℹ️</span>
          </h4>
          <div className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              id="adicionaisSomados"
              checked={config.adicionaisSomados}
              onChange={(e) =>
                setConfig({ ...config, adicionaisSomados: e.target.checked })
              }
              className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <div>
              <label htmlFor="adicionaisSomados" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Adicionais Somados
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ✓ Marcado: Adicional extra + adicional noturno são somados<br/>
                <span className="italic">Ex: 50% (extra) + 30% (noturno) = 80% total</span><br/><br/>
                ✗ Desmarcado: Adicional extra é aplicado em cascata sobre o adicional noturno<br/>
                <span className="italic">Ex: hora base × 1,3 (noturno) × 1,5 (extra) = 1,95x</span>
              </p>
            </div>
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
