interface InputSectionProps {
  inputText: string
  setInputText: (text: string) => void
  somenteExtras: boolean
  setSomenteExtras: (value: boolean) => void
  onCalculate: () => void
  error: string
}

export default function InputSection({
  inputText,
  setInputText,
  somenteExtras,
  setSomenteExtras,
  onCalculate,
  error,
}: InputSectionProps) {
  return (
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
        <li>2024-01-15 08:00	17:00 (com tab)</li>
        <li>2024-01-15 12: 00 - 16:00 (com espaço após :)</li>
        <li>2024-01-15 12: 00	16:00 (com espaço após : e tab)</li>
        <li>2024-01-15 08:00, 2024-01-15 17:00</li>
        <li>15/01/2024 08:00 - 17:00</li>
        <li>15/01/2024 08:00	17:00 (com tab)</li>
        <li>15/01/2024 12: 00 - 16:00 (com espaço após :)</li>
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
        type="button"
        onClick={onCalculate}
        data-testid="calculate-button"
        className="mt-4 w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Calcular Horas
      </button>

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
