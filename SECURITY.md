# 🔐 Guia de Segurança - MentorIA

## Visão Geral de Segurança

Este documento descreve as práticas de segurança implementadas no projeto MentorIA e como manter a aplicação segura.

## 1. Proteção de Credenciais

### ✅ Implementado

#### API Key da Groq
- **Localização**: Apenas no servidor backend (`server.js`)
- **Acesso**: Através de variável de ambiente `GROQ_API_KEY`
- **Nunca**: Exposto no código frontend ou em requisições do cliente

#### Variáveis de Ambiente
```bash
# .env (NUNCA fazer commit)
GROQ_API_KEY=sua_chave_aqui
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3000
NODE_ENV=production
```

#### .gitignore
```
.env
.env.local
.env.*.local
node_modules/
dist/
.DS_Store
*.log
```

### ⚠️ Checklist de Segurança

- [ ] Arquivo `.env` não está versionado no Git
- [ ] `GROQ_API_KEY` não aparece em nenhum arquivo `.js` ou `.jsx`
- [ ] Logs não expõem informações sensíveis
- [ ] Repositório é privado ou credenciais estão rotacionadas

## 2. Validação de Entrada

### Backend (server.js)

Todos os endpoints validam entrada:

```javascript
// ✅ Bom - Validação implementada
app.post('/api/analyze-idea', async (req, res) => {
  const { idea, target, problem } = req.body;
  
  if (!idea || !target || !problem) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // ... processar
});
```

### Frontend (App.jsx)

Validações antes de enviar:

```javascript
// ✅ Bom - Validação no frontend
const analyzeIdea = async () => {
  if (!ideaForm.idea || !ideaForm.target || !ideaForm.problem) {
    setError('Preencha todos os campos obrigatórios');
    return;
  }
  // ... enviar para API
};
```

## 3. Comunicação Segura

### HTTPS em Produção

```javascript
// ✅ Recomendado para produção
const API_CONFIG = {
  endpoint: process.env.VITE_API_ENDPOINT || 'https://api.seu-dominio.com',
  timeout: 30000,
};
```

### CORS Configurado

```javascript
// ✅ Implementado
app.use(cors());

// ⚠️ Recomendado para produção
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST'],
}));
```

## 4. Tratamento de Erros

### ✅ Bom - Erros genéricos para o cliente

```javascript
catch (error) {
  console.error('Erro em /analyze-idea:', error); // Log detalhado no servidor
  res.status(500).json({ error: 'Erro ao processar. Tente novamente.' }); // Genérico para cliente
}
```

### ❌ Ruim - Expor detalhes do erro

```javascript
catch (error) {
  res.status(500).json({ error: error.message }); // ❌ Expõe informações internas
}
```

## 5. Rate Limiting

### Recomendado para Produção

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições, tente novamente mais tarde.',
});

app.use('/api/', limiter);
```

## 6. Autenticação e Autorização

### Futuro - Implementar Autenticação

Para versões futuras, considere adicionar:

```javascript
// Exemplo com JWT
import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/analyze-idea', authenticateToken, async (req, res) => {
  // ... endpoint protegido
});
```

## 7. Logging Seguro

### ✅ Bom - Logs sem informações sensíveis

```javascript
console.log('Requisição recebida em /api/analyze-idea');
console.error('Erro ao chamar Groq API:', error.message);
```

### ❌ Ruim - Logs com informações sensíveis

```javascript
console.log('API Key:', GROQ_API_KEY); // ❌ NUNCA
console.log('Resposta completa:', response); // ⚠️ Pode conter dados sensíveis
```

## 8. Dependências Seguras

### Verificar Vulnerabilidades

```bash
npm audit
npm audit fix
```

### Manter Dependências Atualizadas

```bash
npm outdated
npm update
```

### Dependências Críticas

- `express` - Framework web
- `cors` - Controle de acesso
- `dotenv` - Variáveis de ambiente

## 9. Deployment Seguro

### Variáveis de Ambiente em Produção

**Vercel:**
```
Settings → Environment Variables
GROQ_API_KEY = sua_chave_aqui
VITE_API_ENDPOINT = https://seu-backend.com/api
```

**Heroku:**
```bash
heroku config:set GROQ_API_KEY=sua_chave_aqui
heroku config:set NODE_ENV=production
```

### Secrets Management

Recomendado usar serviços especializados:
- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **1Password**

## 10. Monitoramento e Alertas

### Recomendado para Produção

```javascript
// Exemplo com Sentry
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

## 11. Backup e Disaster Recovery

### Checklist

- [ ] Código versionado em Git
- [ ] Repositório tem backup automático
- [ ] Logs são arquivados
- [ ] Plano de recuperação documentado

## 12. Conformidade e Privacidade

### LGPD (Lei Geral de Proteção de Dados)

Se coletar dados de usuários:

- [ ] Política de privacidade clara
- [ ] Consentimento explícito
- [ ] Direito de acesso aos dados
- [ ] Direito de exclusão
- [ ] Criptografia de dados em trânsito

### GDPR (Regulamento Geral de Proteção de Dados)

Se usuários são da UE:

- [ ] Consentimento informado
- [ ] Direito ao esquecimento
- [ ] Portabilidade de dados
- [ ] Notificação de violações

## 13. Segurança do Frontend

### Content Security Policy (CSP)

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### Proteção contra XSS

React já sanitiza por padrão, mas cuidado com:

```javascript
// ❌ Ruim - Pode executar código
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Bom - Sanitizado automaticamente
<div>{userInput}</div>
```

## 14. Rotação de Credenciais

### Checklist Mensal

- [ ] Rotacionar `GROQ_API_KEY`
- [ ] Revisar logs de acesso
- [ ] Verificar dependências desatualizadas
- [ ] Testar plano de recuperação

### Rotação de Chave Groq

1. Gerar nova chave em https://console.groq.com
2. Atualizar `.env` com a nova chave
3. Testar a aplicação
4. Desabilitar chave antiga
5. Monitorar por erros

## 15. Incident Response

### Se a chave foi exposta:

1. **Imediatamente**: Desabilitar a chave no console Groq
2. **Dentro de 1 hora**: Gerar nova chave
3. **Dentro de 2 horas**: Atualizar em produção
4. **Dentro de 24 horas**: Revisar logs de acesso
5. **Documentar**: O que aconteceu e como prevenir

## 📞 Reportar Vulnerabilidades

Se encontrar uma vulnerabilidade:

1. **NÃO** publique em issues públicas
2. Envie email para: `seguranca@seu-dominio.com`
3. Inclua: descrição, impacto, passos para reproduzir
4. Aguarde resposta em até 48 horas

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security](https://react.dev/learn/security)

## ✅ Checklist Final

Antes de fazer deploy em produção:

- [ ] Arquivo `.env` não está versionado
- [ ] `GROQ_API_KEY` está configurada apenas no servidor
- [ ] CORS está configurado corretamente
- [ ] HTTPS está ativado
- [ ] Rate limiting está implementado
- [ ] Logs não expõem dados sensíveis
- [ ] Dependências estão atualizadas
- [ ] Testes de segurança foram executados
- [ ] Plano de incident response está documentado
- [ ] Backup está configurado

---

**Última atualização**: 2024
**Versão**: 1.0.0
