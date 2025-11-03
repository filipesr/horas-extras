# Calculadora de Horas Extras

Sistema simples e intuitivo para cálculo de horas extras com adicional noturno, desenvolvido em ReactJS/Next.js e otimizado para deploy na Vercel.

## Funcionalidades

- **Cálculo Preciso de Horas Extras**: Identifica automaticamente horas que ultrapassam a jornada diária
- **Adicional Noturno**: Calcula o adicional para horas trabalhadas no período noturno (configurável)
- **Múltiplos Formatos de Entrada**: Aceita diversos formatos de data/hora para facilitar a colagem de registros
- **Configuração Flexível**:
  - Salário por hora ou mensal
  - Percentuais personalizáveis de hora extra e adicional noturno
  - Horário noturno configurável
  - Jornada diária configurável
- **Interface Responsiva**: Design moderno e adaptável para desktop e mobile
- **Modo Escuro**: Suporte automático para modo escuro
- **Relatório Detalhado**: Tabela completa com cada registro e totalizadores

## Como Usar

### 1. Configurações

Preencha os campos de configuração:

- **Tipo de Salário**: Escolha entre "Por Hora" ou "Mensal"
- **Valor do Salário**: Informe o valor em reais
- **Horas Mensais**: Aparece apenas para salário mensal (ex: 220 horas)
- **Horas Diárias de Trabalho**: Jornada diária padrão (ex: 8 horas)
- **Adicional Hora Extra**: Percentual de acréscimo para horas extras (ex: 50%)
- **Adicional Noturno**: Percentual de acréscimo para horas noturnas (ex: 20%)
- **Horário Noturno**: Defina o início e fim do período noturno (padrão: 22h às 5h)

### 2. Registros de Horas

Cole a lista de horas trabalhadas no campo de texto. Formatos aceitos:

```
2024-01-15 08:00 - 17:00
2024-01-15 08:00, 2024-01-15 17:00
15/01/2024 08:00 - 17:00
15/01/2024 08:00, 15/01/2024 17:00
```

**Dica**: Você pode colar múltiplas linhas de uma vez!

### 3. Modo de Cálculo

- **Desmarcado**: Considera a jornada diária e calcula apenas as horas que excedem
- **Marcado** ("Considerar apenas horas extras"): Todas as horas informadas são consideradas extras

### 4. Calcular

Clique no botão "Calcular Horas" para gerar a tabela de resultados.

## Resultados

A tabela mostra para cada registro:

- Data e hora de entrada/saída
- Total de horas trabalhadas
- Horas extras (destacadas em laranja)
- Horas noturnas (destacadas em roxo)
- Valores calculados (normal, extra, noturno e total)
- **Totalizadores** no rodapé da tabela
- **Cards resumo** com totais de horas extras, noturnas e valor total

## Desenvolvimento

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:3000
```

### Build para Produção

```bash
npm run build
npm start
```

## Deploy na Vercel

### Opção 1: Via Interface da Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Importe este repositório
5. A Vercel detectará automaticamente as configurações do Next.js
6. Clique em "Deploy"

### Opção 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

## Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router
- **React 18**: Biblioteca JavaScript para UI
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **date-fns**: Manipulação de datas

## Estrutura do Projeto

```
horas-extras/
├── app/
│   ├── page.tsx          # Componente principal
│   ├── layout.tsx        # Layout da aplicação
│   └── globals.css       # Estilos globais
├── public/               # Arquivos estáticos
├── package.json          # Dependências
├── next.config.js        # Configuração Next.js
├── tailwind.config.js    # Configuração Tailwind
├── tsconfig.json         # Configuração TypeScript
└── README.md            # Este arquivo

```

## Exemplos de Uso

### Exemplo 1: Funcionário com Salário Mensal

**Configurações:**
- Salário: R$ 3.300,00 (mensal)
- Horas Mensais: 220
- Hora Extra: 50%
- Adicional Noturno: 20%

**Entrada:**
```
15/01/2024 08:00 - 17:00
16/01/2024 08:00 - 19:00
17/01/2024 22:00 - 06:00
```

O sistema calculará:
- Valor/hora = R$ 3.300 / 220 = R$ 15,00
- Dia 15: 9h trabalhadas, 1h extra
- Dia 16: 11h trabalhadas, 3h extras
- Dia 17: 8h trabalhadas (todas noturnas)

### Exemplo 2: Freelancer com Valor/Hora

**Configurações:**
- Salário: R$ 50,00 (por hora)
- Hora Extra: 100%
- Adicional Noturno: 30%

**Entrada:**
```
2024-01-20 14:00 - 22:00
2024-01-21 20:00 - 02:00
```

## Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

## Licença

MIT License - Sinta-se livre para usar e modificar este projeto.
