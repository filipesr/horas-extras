'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkRecord, Config } from './types'
import { parseInputText } from './utils/parser'
import { calculateRecord } from './utils/calculator'
import { formatCurrency } from './utils/formatters'
import ConfigurationSection from './components/ConfigurationSection'
import ConfigModal from './components/ConfigModal'
import InputSection from './components/InputSection'
import ResultsTable from './components/ResultsTable'
import SummaryCards from './components/SummaryCards'

export default function Home() {
  const [config, setConfig] = useState<Config>({
    regime: 'Brasil',
    tipoSalario: 'mensal',
    valorSalario: 1000,
    horasMensais: 220,
    currency: 'USD',
    percentualExtra: 50,
    percentualNoturno: 30,
    percentualDomingo: 100,
    percentualFeriado: 100,
    horasDiarias: 8,
    horasSabado: 4,
    inicioNoturno: 22,
    fimNoturno: 6,
    feriados: [],
    sabadosLivres: [],
  })

  const [inputText, setInputText] = useState(``)
  const [records, setRecords] = useState<WorkRecord[]>([])
  const [somenteExtras, setSomenteExtras] = useState(true)
  const [error, setError] = useState<string>('')
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const valorHora =
    config.tipoSalario === 'hora'
      ? config.valorSalario
      : config.valorSalario / config.horasMensais

  const parseInput = useCallback(() => {
    setError('')

    try {
      const parsedRecords = parseInputText(inputText)

      const calculatedRecords = parsedRecords.flatMap(({ entrada, saida }) => {
        const result = calculateRecord(entrada, saida, config, somenteExtras)
        // calculateRecord pode retornar um único registro ou array de registros (quando cruza dias)
        return Array.isArray(result) ? result : [result]
      })

      setRecords(calculatedRecords)
    } catch (error) {
      setError(
        `Erro ao processar os dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      )
    }
  }, [inputText, config, somenteExtras])

  const totais = records.reduce(
    (acc, record) => ({
      horasTrabalhadas: acc.horasTrabalhadas + record.horasTrabalhadas,
      horasExtras: acc.horasExtras + record.horasExtras,
      horasNoturnas: acc.horasNoturnas + record.horasNoturnas,
      valorNormal: acc.valorNormal + record.valorNormal,
      valorExtra: acc.valorExtra + record.valorExtra,
      valorNoturno: acc.valorNoturno + record.valorNoturno,
      valorDomingo: acc.valorDomingo + record.valorDomingo,
      valorFeriado: acc.valorFeriado + record.valorFeriado,
      valorTotal: acc.valorTotal + record.valorTotal,
    }),
    {
      horasTrabalhadas: 0,
      horasExtras: 0,
      horasNoturnas: 0,
      valorNormal: 0,
      valorExtra: 0,
      valorNoturno: 0,
      valorDomingo: 0,
      valorFeriado: 0,
      valorTotal: 0,
    }
  )

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-400 mb-8 text-center print:hidden">
          Calculadora de Horas Extras
        </h1>

        {/* Seção de Salário - Não imprime */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            {/* Informações do Salário */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Tipo: </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {config.tipoSalario === 'hora' ? 'Por Hora' : 'Mensal'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Moeda: </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {config.currency === 'BRL' ? 'R$' : config.currency === 'PYG' ? '₲' : '$'}
                </span>
              </div>
              {valorHora > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Valor/hora: </span>
                  <span className="font-semibold text-primary-700 dark:text-primary-300">
                    {formatCurrency(valorHora, config.currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Input do Valor do Salário */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Salário:
              </label>
              <input
                type="number"
                step="0.01"
                value={config.valorSalario}
                onChange={(e) =>
                  setConfig({ ...config, valorSalario: parseFloat(e.target.value) || 0 })
                }
                className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                placeholder="0.00"
              />
            </div>

            {/* Botão de Configurações */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Config
            </button>
          </div>
        </div>

        {/* Modal de Configurações */}
        <ConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)}>
          <ConfigurationSection
            config={config}
            setConfig={setConfig}
            valorHora={valorHora}
          />
        </ConfigModal>

        {/* Seção de Input - Não imprime */}
        <div className="print:hidden">
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            somenteExtras={somenteExtras}
            setSomenteExtras={setSomenteExtras}
            onCalculate={parseInput}
            error={error}
          />
        </div>

        {/* Tabela de Resultados - Imprime */}
        <ResultsTable records={records} totais={totais} currency={config.currency} />

        {/* Cards de Resumo - Não imprime */}
        {records.length > 0 && (
          <div className="print:hidden">
            <SummaryCards totais={totais} currency={config.currency} />
          </div>
        )}
      </div>
    </main>
  )
}
