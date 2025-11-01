# 🚀 Guia de Deployment - MentorIA

Este documento descreve como fazer deploy da aplicação MentorIA em diferentes plataformas.

## Pré-requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0
- Chave de API da Groq
- Conta em uma plataforma de hosting

## 1. Deploy no Vercel (Frontend + Backend)

### Passo 1: Preparar o Projeto

```bash
# Certifique-se de que tudo está commitado
git status
git add .
git commit -m "Preparar para deployment"
```

### Passo 2: Criar Arquivo vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "GROQ_API_KEY": "@groq_api_key",
    "GROQ_MODEL": "llama-3.3-70b-versatile",
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### Passo 3: Deploy

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

### Passo 4: Configurar Variáveis de Ambiente

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá para Settings → Environment Variables
4. Adicione:
   - `GROQ_API_KEY`: sua chave
   - `VITE_API_ENDPOINT`: https://seu-projeto.vercel.app/api

## 2. Deploy no Heroku

### Passo 1: Preparar o Projeto

Criar arquivo `Procfile`:

```
web: npm run start
```

### Passo 2: Deploy

```bash
# Instalar Heroku CLI
npm install -g heroku

# Fazer login
heroku login

# Criar app
heroku create seu-app-name

# Configurar variáveis de ambiente
heroku config:set GROQ_API_KEY=sua_chave_aqui
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### Passo 3: Verificar

```bash
heroku open
```

## 3. Deploy com Docker

### Passo 1: Criar Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY server.js .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

### Passo 2: Criar docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

### Passo 3: Build e Run

```bash
# Build
docker build -t mentoria-ia .

# Run
docker run -p 3000:3000 \
  -e GROQ_API_KEY=sua_chave_aqui \
  -e NODE_ENV=production \
  mentoria-ia
```

## 4. Deploy no AWS (EC2)

### Passo 1: Criar Instância EC2

1. Acesse AWS Console
2. Crie uma instância Ubuntu 22.04
3. Configure security group para portas 80, 443, 3000

### Passo 2: Conectar e Instalar

```bash
# Conectar via SSH
ssh -i seu-chave.pem ubuntu@seu-ip

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositório
git clone https://github.com/seu-usuario/mentoria-ia.git
cd mentoria-ia

# Instalar dependências
npm install

# Configurar variáveis de ambiente
nano .env
# Adicione suas variáveis
```

### Passo 3: Iniciar com PM2

```bash
# Iniciar aplicação
pm2 start server.js --name "mentoria-ia"

# Salvar configuração
pm2 save

# Iniciar no boot
pm2 startup
```

### Passo 4: Configurar Nginx (Reverse Proxy)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Criar configuração
sudo nano /etc/nginx/sites-available/mentoria-ia
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/mentoria-ia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 5: SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d seu-dominio.com

# Auto-renovação
sudo systemctl enable certbot.timer
```

## 5. Deploy no Railway

### Passo 1: Conectar Repositório

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Autorize e selecione seu repositório

### Passo 2: Configurar Variáveis

1. Vá para Variables
2. Adicione:
   - `GROQ_API_KEY`: sua chave
   - `NODE_ENV`: production

### Passo 3: Deploy

Railway fará deploy automaticamente a cada push para `main`.

## 6. Deploy no Render

### Passo 1: Criar Web Service

1. Acesse https://render.com
2. Clique em "New +"
3. Selecione "Web Service"
4. Conecte seu repositório GitHub

### Passo 2: Configurar

- **Build Command**: `npm install`
- **Start Command**: `npm run start`
- **Environment**: Node
- **Region**: Escolha a mais próxima

### Passo 3: Adicionar Variáveis

1. Vá para Environment
2. Adicione `GROQ_API_KEY` e outras variáveis

## Checklist de Deployment

### Antes de Fazer Deploy

- [ ] Todos os testes passam
- [ ] Código está commitado
- [ ] `.env` não está versionado
- [ ] Variáveis de ambiente estão configuradas
- [ ] Build local funciona (`npm run build`)
- [ ] Não há console.logs sensíveis
- [ ] HTTPS está ativado

### Após o Deployment

- [ ] Acessar URL e testar funcionalidades
- [ ] Verificar logs para erros
- [ ] Testar endpoints da API
- [ ] Monitorar performance
- [ ] Configurar alertas

## Monitoramento

### Logs

```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail

# PM2
pm2 logs mentoria-ia
```

### Performance

Recomendado usar:
- **Datadog** - Monitoramento completo
- **New Relic** - APM
- **Sentry** - Error tracking
- **Uptime Robot** - Monitoramento de disponibilidade

## Troubleshooting

### Erro: "GROQ_API_KEY not found"

```bash
# Verificar variáveis
heroku config  # Heroku
vercel env list  # Vercel

# Reconfigurar
heroku config:set GROQ_API_KEY=sua_chave
```

### Erro: "Port already in use"

```bash
# Mudar porta
PORT=8000 npm run start

# Ou liberar porta
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Erro: "CORS error"

Verificar `VITE_API_ENDPOINT` no frontend:

```javascript
// Deve apontar para o backend em produção
const API_CONFIG = {
  endpoint: process.env.VITE_API_ENDPOINT || 'https://seu-backend.com/api',
};
```

## Rollback

### Vercel

```bash
vercel rollback
```

### Heroku

```bash
heroku releases
heroku rollback v10
```

### Git

```bash
git revert <commit-hash>
git push origin main
```

## Escalabilidade

Para lidar com mais usuários:

1. **Cache**: Implementar Redis
2. **CDN**: Usar Cloudflare
3. **Database**: Adicionar banco de dados
4. **Load Balancer**: Distribuir requisições
5. **Auto-scaling**: Configurar em cloud provider

## Segurança em Produção

- [ ] HTTPS ativado
- [ ] Rate limiting configurado
- [ ] CORS restritivo
- [ ] Headers de segurança
- [ ] Logs sem informações sensíveis
- [ ] Backup automático
- [ ] Monitoramento de segurança

## Referências

- [Vercel Deployment](https://vercel.com/docs)
- [Heroku Deployment](https://devcenter.heroku.com/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

**Última atualização**: 2024-01-15
