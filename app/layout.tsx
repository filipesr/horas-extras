import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculadora de Horas Extras',
  description: 'Sistema simples de cálculo de horas extras com adicional noturno',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">{children}</body>
    </html>
  )
}
