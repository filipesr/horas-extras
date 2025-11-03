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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log('Layout JS loaded', new Date().toISOString());`,
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
