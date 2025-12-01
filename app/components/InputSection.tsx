'use client'

import { useState, useRef } from 'react'

interface InputSectionProps {
  inputText: string
  setInputText: (text: string) => void
  somenteExtras: boolean
  setSomenteExtras: (value: boolean) => void
  onCalculate: () => void
  onJsonImport: (file: File) => void
  error: string
}

export default function InputSection({
  inputText,
  setInputText,
  somenteExtras,
  setSomenteExtras,
  onCalculate,
  onJsonImport,
  error,
}: InputSectionProps) {
  const [showHint, setShowHint] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onJsonImport(file)
      // Reset input para permitir selecionar o mesmo arquivo novamente
      e.target.value = ''
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Registros de Horas Trabalhadas
        </h2>

        {/* Botão de Ajuda */}
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
            onClick={() => setShowHint(!showHint)}
            className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
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
          {showHint && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Formatos Aceitos
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Cole a lista de horas trabalhadas (um registro por linha):
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1 list-disc list-inside">
                <li>2024-01-15 08:00 - 17:00</li>
                <li>2024-01-15 08:00	17:00 (com tab)</li>
                <li>2024-01-15 12: 00 - 16:00 (com espaço após :)</li>
                <li>2024-01-15 12: 00	16:00 (com espaço após : e tab)</li>
                <li>2024-01-15 08:00, 2024-01-15 17:00</li>
                <li>15/01/2024 08:00 - 17:00</li>
                <li>15/01/2024 08:00	17:00 (com tab)</li>
                <li>15/01/2024 12: 00 - 16:00 (com espaço após :)</li>
                <li>15/01/2024 08:00, 15/01/2024 17:00</li>
              </ul>
            </div>
          )}
        </div>
      </div>

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

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
        rows={6}
        placeholder="2024-01-15 08:00 - 17:00&#10;2024-01-16 08:00 - 18:30&#10;2024-01-17 22:00 - 06:00"
      />

      <div className="mt-4 flex gap-3 w-full flex-col md:flex-row">
        <button
          type="button"
          onClick={onCalculate}
          data-testid="calculate-button"
          className="flex-1 md:flex-none px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Calcular Horas
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Importar arquivo JSON"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 md:flex-none px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Importar JSON
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Erro:</strong> {error}
          </p>
        </div>
      )}
    </div>
  )
}
