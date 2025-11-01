# 🤝 Guia de Contribuição - MentorIA

Obrigado por considerar contribuir para o MentorIA! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## Código de Conduta

Este projeto adota um Código de Conduta que esperamos que todos os contribuidores sigam. Por favor, leia [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de contribuir.

## Como Posso Contribuir?

### 🐛 Reportar Bugs

Antes de criar um relatório de bug, verifique a lista de issues, pois você pode descobrir que o bug já foi reportado.

**Como enviar um bom relatório de bug:**

1. Use um título descritivo
2. Descreva os passos exatos para reproduzir o problema
3. Forneça exemplos específicos para demonstrar os passos
4. Descreva o comportamento observado
5. Descreva o comportamento esperado
6. Inclua capturas de tela se possível
7. Mencione sua versão do Node.js e SO

### 💡 Sugerir Melhorias

Sugestões de melhorias são bem-vindas! Ao criar uma sugestão de melhoria, inclua:

1. Um título descritivo
2. Uma descrição detalhada da melhoria sugerida
3. Exemplos de como a melhoria funcionaria
4. Uma explicação do por quê essa melhoria seria útil

### 🔧 Pull Requests

**Processo para submeter um Pull Request:**

1. Fork o repositório e crie sua branch a partir de `main`
2. Se você adicionou código que deve ser testado, adicione testes
3. Certifique-se de que a suite de testes passa
4. Certifique-se de que seu código segue o estilo do projeto
5. Escreva uma mensagem de commit clara
6. Faça push para sua branch
7. Abra um Pull Request

## Processo de Desenvolvimento

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/lucienemunizestrategia-sudo/mentoria-ia.git
cd mentoria-ia

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie o desenvolvimento
npm run dev
```

### Estrutura de Branches

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `bugfix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes

### Exemplo de Workflow

```bash
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Faça suas mudanças
# ...

# Commit suas mudanças
git commit -m "feat: adicionar nova funcionalidade"

# Push para sua branch
git push origin feature/nova-funcionalidade

# Abra um Pull Request
```

## Guia de Estilo

### JavaScript/React

- Use ES6+ syntax
- Use arrow functions
- Use const/let, não var
- Use camelCase para variáveis e funções
- Use PascalCase para componentes React

```javascript
// ✅ Bom
const handleButtonClick = () => {
  const userName = 'João';
  return <UserProfile name={userName} />;
};

// ❌ Ruim
var handleButtonClick = function() {
  var user_name = 'João';
  return <userProfile name={user_name} />;
};
```

### CSS/Tailwind

- Use classes Tailwind existentes
- Mantenha a consistência de cores
- Use responsive design (mobile-first)

```jsx
// ✅ Bom
<button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
  Clique aqui
</button>

// ❌ Ruim
<button style={{backgroundColor: '#7c3aed'}}>Clique aqui</button>
```

### Commits

Use o padrão Conventional Commits:

```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: mudanças de formatação
refactor: refatorar código
test: adicionar testes
chore: atualizar dependências
```

Exemplos:

```bash
git commit -m "feat: adicionar validador de ideias"
git commit -m "fix: corrigir erro de CORS"
git commit -m "docs: atualizar README"
```

## Checklist de Pull Request

Antes de submeter seu PR, verifique:

- [ ] Meu código segue o estilo do projeto
- [ ] Executei `npm run lint` sem erros
- [ ] Adicionei testes para novas funcionalidades
- [ ] Todos os testes passam (`npm test`)
- [ ] Meu código não introduz novos warnings
- [ ] Atualizei a documentação conforme necessário
- [ ] Meus commits têm mensagens descritivas
- [ ] Não incluí credenciais ou informações sensíveis

## Processo de Review

1. Um ou mais mantenedores revisarão seu PR
2. Podem solicitar mudanças
3. Após aprovação, seu PR será merged

## Dúvidas?

- Abra uma issue com a tag `question`
- Consulte a documentação em [README.md](README.md)
- Verifique as issues existentes

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

## Reconhecimento

Contribuidores são reconhecidos em:
- README.md
- Releases notes
- GitHub contributors page

---

**Obrigado por contribuir para o MentorIA! 🚀**
