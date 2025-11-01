# MentorIA - Seu Mentor de Negócios com IA

Uma plataforma web completa que oferece consultoria de negócios baseada em Inteligência Artificial, utilizando o modelo Llama 3.3 70B da Groq API.

## 🎯 Funcionalidades

### 1. **Validador de Ideias**
Analise a viabilidade da sua ideia de negócio em minutos. Receba um score detalhado, análise de forças, pontos de atenção e próximos passos práticos.

### 2. **Diagnóstico Rápido do Negócio**
Avalie o estágio atual do seu negócio em detalhes. Fornece score geral, análise de forças, fraquezas, prioridades e recomendações estratégicas.

### 3. **Calculadora de Precificação**
Calcule a estratégia de precificação ideal para seu produto ou serviço. Inclui análise de custos, margens, posicionamento e psicologia de preços.

### 4. **Plano de Negócios**
Gere um plano de negócios estruturado e acionável com análise de mercado, estrutura de custos e estratégia de receita.

### 5. **Estratégia de Marketing**
Crie um plano de marketing completo para seus primeiros 30 dias com canais recomendados, táticas e métricas de sucesso.

### 6. **Pitch de Elevador**
Gere discursos de venda profissionais em 30 segundos, 1 minuto e 2 minutos com dicas de apresentação e palavras-chave.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura **full-stack** com separação clara entre frontend e backend:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  App.jsx - Componente Principal                    │   │
│  │  - Gerenciamento de estado                         │   │
│  │  - Interface do usuário                            │   │
│  │  - Chamadas seguras para o backend                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  server.js - API Endpoints                         │   │
│  │  - /api/analyze-idea                               │   │
│  │  - /api/generate-diagnostic                        │   │
│  │  - /api/calculate-pricing                          │   │
│  │  - /api/generate-business-plan                     │   │
│  │  - /api/generate-marketing                         │   │
│  │  - /api/generate-pitch                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                    Groq API (Llama 3.3 70B)                │
│                                                             │
│  Processamento de IA com modelos de linguagem avançados    │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Segurança

### ✅ Implementações de Segurança

1. **API Key Protegida**: A chave da Groq API é mantida **apenas no servidor backend**, nunca exposta no frontend.
2. **Variáveis de Ambiente**: Todas as credenciais são gerenciadas através de arquivo `.env` (não versionado).
3. **CORS Configurado**: Apenas requisições do frontend autorizado são aceitas.
4. **Validação de Entrada**: Todos os endpoints validam os dados recebidos.
5. **Tratamento de Erros**: Erros são capturados e retornados de forma segura.

### ⚠️ O que NÃO fazer

- ❌ Nunca exponha `GROQ_API_KEY` no código frontend
- ❌ Nunca faça commit do arquivo `.env` com credenciais reais
- ❌ Nunca exponha logs com informações sensíveis
- ❌ Nunca compartilhe a chave da API em repositórios públicos

## 📋 Pré-requisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Chave de API da Groq** (obtenha em https://console.groq.com)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/lucienemunizestrategia-sudo/mentoria-ia.git
cd mentoria-ia
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# API Configuration
VITE_API_ENDPOINT=http://localhost:3000/api

# Groq API Configuration (Backend only)
GROQ_API_KEY=sua_chave_aqui
GROQ_MODEL=llama-3.3-70b-versatile

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 💻 Desenvolvimento

### Executar em modo desenvolvimento

**Terminal 1 - Backend (porta 3000):**
```bash
npm run server:dev
```

**Terminal 2 - Frontend (porta 5173):**
```bash
npm run dev
```

Acesse a aplicação em: `http://localhost:5173`

### Verificar saúde da API

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "MentorIA API is running"
}
```

## 📦 Build para Produção

### Frontend

```bash
npm run build
```

Gera arquivos otimizados em `dist/`

### Executar em Produção

```bash
npm run start
```

## 📁 Estrutura do Projeto

```
mentoria-ia/
├── src/
│   ├── App.jsx              # Componente principal React
│   ├── main.jsx             # Entry point React
│   └── index.css            # Estilos globais
├── server.js                # Backend Express
├── index.html               # HTML template
├── package.json             # Dependências
├── vite.config.js           # Configuração Vite
├── tailwind.config.js       # Configuração Tailwind
├── postcss.config.js        # Configuração PostCSS
├── .env.example             # Exemplo de variáveis
├── .gitignore               # Arquivos ignorados pelo Git
├── README.md                # Este arquivo
└── SECURITY.md              # Guia de segurança
```

## 🔌 API Endpoints

### POST `/api/analyze-idea`

Analisa a viabilidade de uma ideia de negócio.

**Request:**
```json
{
  "idea": "Aplicativo de delivery de comida saudável",
  "target": "Atletas amadores entre 25-40 anos",
  "problem": "Dificuldade em encontrar refeições balanceadas"
}
```

**Response:**
```json
{
  "score": 85,
  "viabilidade": "alta",
  "frase_impacto": "Uma solução prática para atletas ocupados",
  "pontos_fortes": ["Mercado em crescimento", "Público bem definido"],
  "pontos_atencao": ["Concorrência forte", "Logística complexa"],
  "proximos_passos": ["Validar com 20 potenciais clientes", "Estudar concorrentes"]
}
```

### POST `/api/generate-diagnostic`

Gera diagnóstico completo do negócio.

**Request:**
```json
{
  "businessName": "TechFlow",
  "stage": "MVP",
  "monthlyRevenue": "R$ 50.000",
  "teamSize": 3,
  "mainChallenge": "Crescimento de usuários",
  "marketPosition": "Entrante",
  "customerSatisfaction": 8,
  "operationalMaturity": 6,
  "financialHealth": 7,
  "growthRate": 15
}
```

### POST `/api/calculate-pricing`

Calcula estratégia de precificação.

**Request:**
```json
{
  "productName": "Curso Online",
  "productCost": 50,
  "desiredMargin": 50,
  "competitorPrice": 150,
  "targetMarket": "PMEs"
}
```

### POST `/api/generate-business-plan`

Gera plano de negócios estruturado.

**Request:**
```json
{
  "business": "Plataforma SaaS de gestão",
  "market": "Pequenas empresas",
  "investment": "R$ 100.000",
  "timeline": "18 meses",
  "experience": "10 anos em tecnologia",
  "competitors": "Empresa A, Empresa B",
  "differentials": "Interface intuitiva, preço competitivo"
}
```

### POST `/api/generate-marketing`

Gera estratégia de marketing para 30 dias.

**Request:**
```json
{
  "product": "Aplicativo de fitness",
  "audience": "Mulheres entre 25-35 anos",
  "budget": 5000
}
```

### POST `/api/generate-pitch`

Gera pitches de elevador em diferentes durações.

**Request:**
```json
{
  "businessName": "TechFlow",
  "problemStatement": "Gestão complexa de projetos",
  "solution": "Plataforma intuitiva e colaborativa",
  "targetAudience": "Startups de tecnologia",
  "differentiator": "IA integrada",
  "callToAction": "Agende uma demo"
}
```

## 🎨 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **Fetch API** - Requisições HTTP

### Backend
- **Express.js** - Framework web
- **Node.js** - Runtime JavaScript
- **CORS** - Controle de acesso
- **Dotenv** - Gerenciamento de variáveis

### IA
- **Groq API** - Acesso ao Llama 3.3 70B
- **JSON Parsing** - Estruturação de respostas

## 📊 Performance

- **Frontend**: Otimizado com Vite, ~50KB gzipped
- **Backend**: Resposta média < 3s com Groq API
- **Cache**: Implementar cache de respostas em produção
- **CDN**: Recomendado para arquivos estáticos

## 🐛 Troubleshooting

### Erro: "GROQ_API_KEY not configured"
- Verifique se o arquivo `.env` existe
- Confirme que `GROQ_API_KEY` está preenchida
- Reinicie o servidor

### Erro: "Cannot connect to API"
- Verifique se o backend está rodando na porta 3000
- Confirme a configuração de CORS
- Verifique `VITE_API_ENDPOINT` no frontend

### Erro: "Invalid JSON response"
- Verifique a chave da API Groq
- Confirme que o modelo está correto
- Verifique os logs do servidor

## 📝 Logging

O servidor registra automaticamente:
- Requisições recebidas
- Erros de API
- Erros de parsing JSON
- Informações de inicialização

Verifique os logs no console do servidor.

## 🚀 Deploy

### Vercel (Frontend)

```bash
npm run build
# Fazer upload da pasta 'dist'
```

### Heroku (Backend)

```bash
heroku create seu-app
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 👤 Autor

**Luciene Muniz**
- GitHub: [@lucienemunizestrategia-sudo](https://github.com/lucienemunizestrategia-sudo)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

## 🔗 Links Úteis

- [Documentação Groq API](https://console.groq.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Express.js Documentation](https://expressjs.com)

---

**Desenvolvido com ❤️ para empreendedores**
