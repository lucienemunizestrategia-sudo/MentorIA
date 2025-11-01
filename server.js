import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());

// ============= CONFIGURAÇÃO DA API GROQ =============
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.error('ERRO: GROQ_API_KEY não configurada em .env');
  process.exit(1);
}

// ============= FUNÇÕES AUXILIARES =============
const callGroqAPI = async (systemPrompt, userPrompt) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from Groq API');
    }

    const text = data.choices[0].message.content;
    const cleanText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Erro ao chamar Groq API:', error);
    throw error;
  }
};

// ============= ENDPOINTS =============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MentorIA API is running' });
});

// Analisar Ideia
app.post('/api/analyze-idea', async (req, res) => {
  try {
    const { idea, target, problem } = req.body;

    if (!idea || !target || !problem) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const systemPrompt =
      'Você é um mentor de negócios de elite. Sempre retorne JSON válido.';

    const userPrompt = `Analise esta ideia como um mentor de negócios internacional de elite, que cobra R$ 50 mil por hora. Use linguagem acessível, mas com profundidade estratégica. Seja honesto, direto e pragmático — sem rodeios ou motivação genérica. Aponte de forma clara as forças, riscos e próximos passos práticos, sempre com foco em ação e viabilidade real.

IDEIA: ${idea}
PÚBLICO: ${target}
PROBLEMA: ${problem}

Retorne APENAS este JSON válido (sem markdown, sem texto adicional):
{
  "score": 85,
  "viabilidade": "alta",
  "frase_impacto": "Uma frase curta e direta que captura a essência estratégica desta ideia",
  "pontos_fortes": ["Força 1", "Força 2", "Força 3"],
  "pontos_atencao": ["Atenção 1", "Atenção 2"],
  "proximos_passos": ["Ação 1", "Ação 2", "Ação 3"]
}`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Erro em /analyze-idea:', error);
    res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
  }
});

// Gerar Diagnóstico
app.post('/api/generate-diagnostic', async (req, res) => {
  try {
    const {
      businessName,
      stage,
      monthlyRevenue,
      teamSize,
      mainChallenge,
      marketPosition,
      customerSatisfaction,
      operationalMaturity,
      financialHealth,
      growthRate,
    } = req.body;

    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    const systemPrompt = 'Você é um consultor de negócios elite. Retorne JSON válido.';

    const userPrompt = `Faça um diagnóstico profundo do negócio como faria um consultor estratégico global que cobra R$ 50 mil por hora.

NEGÓCIO: ${businessName}
ESTÁGIO: ${stage}
RECEITA MENSAL: ${monthlyRevenue}
TAMANHO DO TIME: ${teamSize}
PRINCIPAL DESAFIO: ${mainChallenge}
POSIÇÃO NO MERCADO: ${marketPosition}
SATISFAÇÃO DO CLIENTE: ${customerSatisfaction}
MATURIDADE OPERACIONAL: ${operationalMaturity}
SAÚDE FINANCEIRA: ${financialHealth}
TAXA DE CRESCIMENTO: ${growthRate}

Retorne APENAS este JSON:
{
  "overallScore": 75,
  "frase_impacto": "Uma frase curta e direta",
  "strengths": ["força 1", "força 2", "força 3"],
  "weaknesses": ["fraqueza 1", "fraqueza 2"],
  "priorities": ["prioridade 1", "prioridade 2", "prioridade 3"],
  "recommendations": ["recomendação 1", "recomendação 2"]
}`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Erro em /generate-diagnostic:', error);
    res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
  }
});

// Calcular Precificação
app.post('/api/calculate-pricing', async (req, res) => {
  try {
    const { productName, productCost, desiredMargin, competitorPrice, targetMarket } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const systemPrompt =
      'Você é um especialista em precificação e estratégia de preços. Retorne JSON válido.';

    const userPrompt = `Calcule a estratégia de precificação ideal como faria um especialista que cobra R$ 50 mil por hora.

PRODUTO: ${productName}
CUSTO: R$ ${productCost}
MARGEM DESEJADA: ${desiredMargin}%
PREÇO CONCORRENTE: R$ ${competitorPrice}
MERCADO-ALVO: ${targetMarket}

Retorne APENAS este JSON:
{
  "minPrice": 100,
  "idealPrice": 150,
  "premiumPrice": 200,
  "minMargin": 50,
  "idealMargin": 75,
  "premiumMargin": 100,
  "breakEvenPoint": 500,
  "positioning": "descrição do posicionamento",
  "recommendation": "recomendação estratégica",
  "psychologyTips": ["dica 1", "dica 2"]
}`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Erro em /calculate-pricing:', error);
    res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
  }
});

// Gerar Plano de Negócios
app.post('/api/generate-business-plan', async (req, res) => {
  try {
    const { business, market, investment, timeline, experience, competitors, differentials } =
      req.body;

    if (!business) {
      return res.status(400).json({ error: 'Business description is required' });
    }

    const systemPrompt = 'Você é consultor de negócios elite. Retorne JSON válido.';

    const userPrompt = `Crie um plano de negócios robusto como faria um consultor estratégico global.

NEGÓCIO: ${business}
MERCADO: ${market}
INVESTIMENTO: ${investment}
PRAZO: ${timeline}
EXPERIÊNCIA: ${experience}
CONCORRENTES: ${competitors}
DIFERENCIAIS: ${differentials}

Retorne APENAS este JSON:
{
  "frase_impacto": "Uma frase curta e direta",
  "resumo_executivo": "Resumo em 2-3 frases",
  "analise_mercado": {
    "tamanho_mercado": "Tamanho estimado",
    "publico_alvo": "Descrição do público",
    "tendencias": "Tendências atuais"
  },
  "estrutura_custos": {
    "investimento_inicial": ["Item 1: R$ valor"],
    "custos_fixos_mensais": ["Custo 1: R$ valor/mês"],
    "custos_variaveis": ["Item 1 variável"]
  },
  "estrategia_receita": "Descrição da estratégia"
}`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Erro em /generate-business-plan:', error);
    res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
  }
});

// Gerar Estratégia de Marketing
app.post('/api/generate-marketing', async (req, res) => {
  try {
    const { product, audience, budget } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'Product description is required' });
    }

    const systemPrompt =
      'Você é um especialista em marketing digital e estratégia. Retorne JSON válido.';

    const userPrompt = `Crie um plano de marketing para os primeiros 30 dias como faria um especialista que cobra R$ 50 mil por hora.

PRODUTO: ${product}
PÚBLICO-ALVO: ${audience}
ORÇAMENTO: R$ ${budget}

Retorne APENAS este JSON:
{
  "frase_impacto": "Uma frase curta e direta",
  "descricao": "Descrição geral da estratégia",
  "canais": ["Canal 1", "Canal 2", "Canal 3"],
  "taticas": ["Tática 1", "Tática 2", "Tática 3"],
  "metricas": ["Métrica 1", "Métrica 2", "Métrica 3"]
}`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Erro em /generate-marketing:', error);
    res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
  }
});

// Gerar Pitch
app.post('/api/generate-pitch', async (req, res) => {
  try {
    const { businessName, problemStatement, solution, targetAudience, differentiator, callToAction } =
      req.body;

    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    const systemPrompt =
      'Você é um especialista em pitch de elevador e comunicação de negócios. Retorne JSON válido.';

    const userPrompt = `Crie pitches de elevador profissionais e impactantes para diferentes contextos.

NEGÓCIO: ${businessName}
PROBLEMA: ${problemStatement}
SOLUÇÃO: ${solution}
PÚBLICO-ALVO: ${targetAudience}
DIFERENCIAL: ${differentiator}
CHAMADA À AÇÃO: ${callToAction}

Retorne APENAS este JSON:
{
  "pitch30": "Pitch de 30 segundos",
  "pitch60": "Pitch de 60 segundos",
  "pitch120": "Pitch de 2 minutos",
  "tips": ["dica 1", "dica 2", "dica 3"],
  "keywords": ["palavra-chave 1", "palavra-chave 2", "palavra-chave 3"]
}`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Erro em /generate-pitch:', error);
    res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
  }
});

// ============= ERROR HANDLING =============
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ============= INICIAR SERVIDOR =============
app.listen(PORT, () => {
  console.log(`✅ MentorIA API rodando em http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
});
