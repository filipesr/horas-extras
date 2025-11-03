export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatCurrency = (value: number, currency: 'BRL' | 'PYG' | 'USD' = 'BRL'): string => {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'PYG' ? 'es-PY' : 'en-US'
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  })
}

export const formatHours = (hours: number): string => {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h${m.toString().padStart(2, '0')}min`
}
