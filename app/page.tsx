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
    tipoSalario: 'mensal',
    valorSalario: 0,
    horasMensais: 220,
    currency: 'BRL',
    percentualExtra: 50,
    percentualNoturno: 20,
    percentualDomingo: 100,
    percentualFeriado: 100,
    horasDiarias: 8,
    horasSabado: 6,
    inicioNoturno: 20,
    fimNoturno: 5,
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

      const calculatedRecords = parsedRecords.map(({ entrada, saida }) =>
        calculateRecord(entrada, saida, config, somenteExtras)
      )

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

        {/* Seção de Salário e Configurações - Não imprime */}
        <div className="mb-8 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salário Configurado
              </h2>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Tipo:</strong>{' '}
                  {config.tipoSalario === 'hora' ? 'Por Hora' : 'Mensal'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Valor:</strong> {formatCurrency(config.valorSalario, config.currency)}
                </p>
                {valorHora > 0 && (
                  <p className="text-sm text-primary-800 dark:text-primary-200">
                    <strong>Valor da hora:</strong> {formatCurrency(valorHora, config.currency)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
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
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
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
