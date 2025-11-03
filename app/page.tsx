'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkRecord, Config } from './types'
import { parseInputText } from './utils/parser'
import { calculateRecord } from './utils/calculator'
import ConfigurationSection from './components/ConfigurationSection'
import InputSection from './components/InputSection'
import ResultsTable from './components/ResultsTable'
import SummaryCards from './components/SummaryCards'

export default function Home() {
  const [config, setConfig] = useState<Config>({
    tipoSalario: 'mensal',
    valorSalario: 5000,
    horasMensais: 220,
    percentualExtra: 50,
    percentualNoturno: 20,
    horasDiarias: 8,
    inicioNoturno: 22,
    fimNoturno: 5,
  })

  const [inputText, setInputText] = useState(`2025-01-15 12:00 - 16:00
2025-01-16 13:00 - 19:00
2025-01-17 17:00 - 18:00`)
  const [records, setRecords] = useState<WorkRecord[]>([])
  const [somenteExtras, setSomenteExtras] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    console.log('Component mounted successfully')
    console.log('React is running')
  }, [])

  const valorHora =
    config.tipoSalario === 'hora'
      ? config.valorSalario
      : config.valorSalario / config.horasMensais

  const parseInput = useCallback(() => {
    console.log('parseInput called')
    setError('')

    try {
      const parsedRecords = parseInputText(inputText)

      const calculatedRecords = parsedRecords.map(({ entrada, saida }) =>
        calculateRecord(entrada, saida, config, somenteExtras)
      )

      setRecords(calculatedRecords)
      console.log('parseInput completed successfully', calculatedRecords.length, 'records')
    } catch (error) {
      console.error('Error in parseInput:', error)
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
      valorTotal: acc.valorTotal + record.valorTotal,
    }),
    {
      horasTrabalhadas: 0,
      horasExtras: 0,
      horasNoturnas: 0,
      valorNormal: 0,
      valorExtra: 0,
      valorNoturno: 0,
      valorTotal: 0,
    }
  )

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-400 mb-8 text-center">
          Calculadora de Horas Extras
        </h1>

        <ConfigurationSection
          config={config}
          setConfig={setConfig}
          valorHora={valorHora}
        />

        <InputSection
          inputText={inputText}
          setInputText={setInputText}
          somenteExtras={somenteExtras}
          setSomenteExtras={setSomenteExtras}
          onCalculate={parseInput}
          error={error}
        />

        <ResultsTable records={records} totais={totais} />

        {records.length > 0 && <SummaryCards totais={totais} />}
      </div>
    </main>
  )
}
