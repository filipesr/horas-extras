import { WorkRecord } from '../types'

interface ParsedDate {
  entrada: Date | null
  saida: Date | null
}

/**
 * Parse uma linha de texto e extrai as datas de entrada e saída
 * Suporta múltiplos formatos incluindo tab entre valores
 */
export const parseLine = (line: string): ParsedDate => {
  // Formatos aceitos:
  // 1. 2024-01-15 08:00 - 17:00
  // 2. 2024-01-15 08:00	17:00 (com tab)
  // 3. 2024-01-15 08:00, 2024-01-15 17:00
  // 4. 15/01/2024 08:00 - 17:00
  // 5. 15/01/2024 08:00	17:00 (com tab)
  // 6. 15/01/2024 08:00, 15/01/2024 17:00
  // 7. 12: 00 - 16:00 (com espaço após dois-pontos)
  // 8. 12: 00	16:00 (com espaço após dois-pontos e tab)

  const patterns: Array<{
    regex: RegExp
    parser: (match: RegExpMatchArray) => ParsedDate
  }> = [
    // ISO format com espaço após dois-pontos: 2024-01-15 12: 00 - 16:00
    {
      regex: /(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):\s*(\d{2})\s*[-–]\s*(\d{1,2}):\s*(\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[1]}T${match[2].padStart(2, '0')}:${match[3]}`),
        saida: new Date(`${match[1]}T${match[4].padStart(2, '0')}:${match[5]}`),
      }),
    },
    // ISO format com tab entre horários: 2024-01-15 12:00	16:00 ou 12: 00	16:00
    {
      regex: /(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):\s*(\d{2})\s+(\d{1,2}):\s*(\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[1]}T${match[2].padStart(2, '0')}:${match[3]}`),
        saida: new Date(`${match[1]}T${match[4].padStart(2, '0')}:${match[5]}`),
      }),
    },
    // ISO format padrão: 2024-01-15 08:00 - 17:00
    {
      regex: /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[1]}T${match[2]}`),
        saida: new Date(`${match[1]}T${match[3]}`),
      }),
    },
    // ISO format com vírgula: 2024-01-15 08:00, 2024-01-15 17:00
    {
      regex: /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}),\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[1]}T${match[2]}`),
        saida: new Date(`${match[3]}T${match[4]}`),
      }),
    },
    // BR format com espaço após dois-pontos: 15/01/2024 12: 00 - 16:00
    {
      regex: /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):\s*(\d{2})\s*[-–]\s*(\d{1,2}):\s*(\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4].padStart(2, '0')}:${match[5]}`),
        saida: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[6].padStart(2, '0')}:${match[7]}`),
      }),
    },
    // BR format com tab entre horários: 15/01/2024 12:00	16:00 ou 12: 00	16:00
    {
      regex: /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):\s*(\d{2})\s+(\d{1,2}):\s*(\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4].padStart(2, '0')}:${match[5]}`),
        saida: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[6].padStart(2, '0')}:${match[7]}`),
      }),
    },
    // BR format padrão: 15/01/2024 08:00 - 17:00
    {
      regex: /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4]}`),
        saida: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[5]}`),
      }),
    },
    // BR format com vírgula: 15/01/2024 08:00, 15/01/2024 17:00
    {
      regex: /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2}),\s*(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}:\d{2})/,
      parser: (match) => ({
        entrada: new Date(`${match[3]}-${match[2]}-${match[1]}T${match[4]}`),
        saida: new Date(`${match[7]}-${match[6]}-${match[5]}T${match[8]}`),
      }),
    },
  ]

  for (const { regex, parser } of patterns) {
    const match = line.match(regex)
    if (match) {
      const result = parser(match)
      return result
    }
  }

  return { entrada: null, saida: null }
}

/**
 * Parse o texto de input e retorna um array de registros parciais (sem cálculos)
 */
export const parseInputText = (inputText: string): Array<{ entrada: Date; saida: Date }> => {
  const lines = inputText.trim().split('\n')

  const parsedRecords: Array<{ entrada: Date; saida: Date }> = []

  for (const line of lines) {
    if (!line.trim()) continue

    const { entrada, saida } = parseLine(line)

    if (entrada && saida && !isNaN(entrada.getTime()) && !isNaN(saida.getTime())) {
      // Se saída é antes da entrada, assumir que é no dia seguinte
      let finalSaida = saida
      if (saida < entrada) {
        finalSaida = new Date(saida.getTime() + 24 * 60 * 60 * 1000)
      }

      parsedRecords.push({ entrada, saida: finalSaida })
    } else if (entrada || saida) {
      console.log('Invalid dates - entrada:', entrada, 'saida:', saida)
    }
  }

  return parsedRecords
}
