'use client'

import { useState } from 'react'

interface WorkRecord {
  id: string
  entrada: Date
  saida: Date
  horasTrabalhadas: number
  horasExtras: number
  horasNoturnas: number
  valorNormal: number
  valorExtra: number
  valorNoturno: number
  valorTotal: number
}

interface Config {
  tipoSalario: 'hora' | 'mensal'
  valorSalario: number
  horasMensais: number
  percentualExtra: number
  percentualNoturno: number
  horasDiarias: number
  inicioNoturno: number
  fimNoturno: number
}

export default function Home() {
  const [config, setConfig] = useState<Config>({
    tipoSalario: 'mensal',
    valorSalario: 0,
    horasMensais: 220,
    percentualExtra: 50,
    percentualNoturno: 20,
    horasDiarias: 8,
    inicioNoturno: 22,
    fimNoturno: 5,
  })

  const [inputText, setInputText] = useState('')
  const [records, setRecords] = useState<WorkRecord[]>([])
  const [somenteExtras, setSomenteExtras] = useState(false)

  const valorHora = config.tipoSalario === 'hora'
    ? config.valorSalario
    : config.valorSalario / config.horasMensais

  const parseInput = () => {
    const lines = inputText.trim().split('\n')
    const parsedRecords: WorkRecord[] = []

    for (const line of lines) {
      if (!line.trim()) continue

      // Formatos aceitos:
      // 2024-01-15 08:00 - 17:00
      // 2024-01-15 08:00, 2024-01-15 17:00
      // 15/01/2024 08:00 - 17:00
      // 15/01/2024 08:00, 15/01/2024 17:00

      const patterns = [
        // ISO format: 2024-01-15 08:00 - 17:00
        /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/,
        // ISO format with comma: 2024-01-15 08:00, 2024-01-15 17:00
        /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}),\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/,
        // BR format: 15/01/2024 08:00 - 17:00
        /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/,
        // BR format with comma: 15/01/2024 08:00, 15/01/2024 17:00
        /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2}),\s*(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2})/,
      ]

      let entrada: Date | null = null
      let saida: Date | null = null

      for (const pattern of patterns) {
        const match = line.match(pattern)
        if (match) {
          if (pattern === patterns[0]) {
            // 2024-01-15 08:00 - 17:00
            entrada = new Date(`${match[1]}T${match[2]}`)
            saida = new Date(`${match[1]}T${match[3]}`)
          } else if (pattern === patterns[1]) {
            // 2024-01-15 08:00, 2024-01-15 17:00
            entrada = new Date(`${match[1]}T${match[2]}`)
            saida = new Date(`${match[3]}T${match[4]}`)
          } else if (pattern === patterns[2]) {
            // 15/01/2024 08:00 - 17:00
            entrada = new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4]}`)
            saida = new Date(`${match[3]}-${match[2]}-${match[1]}T${match[5]}`)
          } else if (pattern === patterns[3]) {
            // 15/01/2024 08:00, 15/01/2024 17:00
            entrada = new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4]}`)
            saida = new Date(`${match[7]}-${match[6]}-${match[5]}T${match[8]}`)
          }
          break
        }
      }

      if (entrada && saida && !isNaN(entrada.getTime()) && !isNaN(saida.getTime())) {
        // Se saída é antes da entrada, assumir que é no dia seguinte
        if (saida < entrada) {
          saida = new Date(saida.getTime() + 24 * 60 * 60 * 1000)
        }

        const record = calculateRecord(entrada, saida)
        parsedRecords.push(record)
      }
    }

    setRecords(parsedRecords)
  }

  const isHorarioNoturno = (hora: number): boolean => {
    if (config.inicioNoturno > config.fimNoturno) {
      // Ex: 22h às 5h (cruza meia-noite)
      return hora >= config.inicioNoturno || hora < config.fimNoturno
    } else {
      // Ex: 0h às 6h
      return hora >= config.inicioNoturno && hora < config.fimNoturno
    }
  }

  const calculateRecord = (entrada: Date, saida: Date): WorkRecord => {
    const diffMs = saida.getTime() - entrada.getTime()
    const horasTrabalhadas = diffMs / (1000 * 60 * 60)

    // Calcular horas noturnas
    let horasNoturnas = 0
    let currentTime = new Date(entrada)

    while (currentTime < saida) {
      const hora = currentTime.getHours() + currentTime.getMinutes() / 60
      if (isHorarioNoturno(Math.floor(hora))) {
        const nextHour = new Date(currentTime.getTime() + 60 * 60 * 1000)
        const endCheck = nextHour < saida ? nextHour : saida
        horasNoturnas += (endCheck.getTime() - currentTime.getTime()) / (1000 * 60 * 60)
        currentTime = nextHour
      } else {
        currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000)
      }
    }

    // Calcular horas extras (acima da jornada diária)
    let horasExtras = 0
    if (somenteExtras) {
      horasExtras = horasTrabalhadas
    } else {
      horasExtras = Math.max(0, horasTrabalhadas - config.horasDiarias)
    }

    // Calcular valores
    const horasNormais = horasTrabalhadas - horasExtras
    const valorNormal = horasNormais * valorHora
    const valorExtra = horasExtras * valorHora * (1 + config.percentualExtra / 100)
    const valorNoturno = horasNoturnas * valorHora * (config.percentualNoturno / 100)
    const valorTotal = valorNormal + valorExtra + valorNoturno

    return {
      id: `${entrada.getTime()}-${saida.getTime()}`,
      entrada,
      saida,
      horasTrabalhadas,
      horasExtras,
      horasNoturnas,
      valorNormal,
      valorExtra,
      valorNoturno,
      valorTotal,
    }
  }

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

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const formatHours = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h${m.toString().padStart(2, '0')}min`
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-400 mb-8 text-center">
          Calculadora de Horas Extras
        </h1>

        {/* Configurações */}
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
                onChange={(e) => setConfig({ ...config, tipoSalario: e.target.value as 'hora' | 'mensal' })}
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
                onChange={(e) => setConfig({ ...config, valorSalario: parseFloat(e.target.value) || 0 })}
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
                  onChange={(e) => setConfig({ ...config, horasMensais: parseInt(e.target.value) || 0 })}
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
                onChange={(e) => setConfig({ ...config, horasDiarias: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setConfig({ ...config, percentualExtra: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setConfig({ ...config, percentualNoturno: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setConfig({ ...config, inicioNoturno: parseInt(e.target.value) || 0 })}
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
                onChange={(e) => setConfig({ ...config, fimNoturno: parseInt(e.target.value) || 0 })}
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

        {/* Input de Horas */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Registros de Horas Trabalhadas
          </h2>

          <div className="mb-4">
            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={somenteExtras}
                onChange={(e) => setSomenteExtras(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span>Considerar apenas horas extras (não descontar jornada diária)</span>
            </label>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Cole a lista de horas trabalhadas (um registro por linha). Formatos aceitos:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-500 mb-4 list-disc list-inside space-y-1">
            <li>2024-01-15 08:00 - 17:00</li>
            <li>2024-01-15 08:00, 2024-01-15 17:00</li>
            <li>15/01/2024 08:00 - 17:00</li>
            <li>15/01/2024 08:00, 15/01/2024 17:00</li>
          </ul>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
            rows={6}
            placeholder="2024-01-15 08:00 - 17:00&#10;2024-01-16 08:00 - 18:30&#10;2024-01-17 22:00 - 06:00"
          />

          <button
            onClick={parseInput}
            className="mt-4 w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Calcular Horas
          </button>
        </div>

        {/* Tabela de Registros */}
        {records.length > 0 && (
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
                    <td colSpan={2} className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 border-t-2 border-primary-400 dark:border-primary-600">
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

            {/* Cards com resumo para mobile */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
                  Total Horas Extras
                </h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatHours(totais.horasExtras)}
                </p>
                <p className="text-lg text-orange-700 dark:text-orange-300 mt-1">
                  {formatCurrency(totais.valorExtra)}
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
                  {formatCurrency(totais.valorNoturno)}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Valor Total Geral
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totais.valorTotal)}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {formatHours(totais.horasTrabalhadas)} trabalhadas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
