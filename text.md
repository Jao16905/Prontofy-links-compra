# Diretrizes de Implementação: Trackeamento Avançado (GTM, sGTM e LGPD)

## 1. Contexto e Papel do Agente
Você atuará como um Engenheiro de Dados e Desenvolvedor Front-end Especialista (React/Next.js). Sua missão é implementar o rastreamento de eventos na aplicação, seguindo rigorosamente a arquitetura de Server-Side Tracking (sGTM) e o Google Consent Mode v2 (LGPD), sem usar cookies de terceiros.

A infraestrutura consiste em:
- **Aplicações:** Front-end em Next.js (App Router) e React puro.
- **Roteamento:** Google Tag Manager (GTM Web).
- **Servidor:** GTM Server-Side (sGTM) rodando em subdomínio próprio (ex: `tracking.prontofy.com.br`).
- **Destinos:** GA4 e Meta Pixel via Conversions API.

## 2. Padrão de Nomenclatura
Sempre que for gerar um disparo de evento, obedeça às seguintes regras de formatação para o objeto do `dataLayer`:
- **Nomes de Eventos:** `snake_case` (ex: `agendamento_realizado`, `cadastro_medico_concluido`).
- **Nomes de Parâmetros:** `snake_case` em inglês ou português padronizado (ex: `plan_type`, `specialty`, `value`, `currency`).
- **Valores Monetários:** Sempre numéricos (float), sem símbolos de moeda ou formatação de string.

Baseie os nomes de acordo com o arquivo `eventos_tracking.md`

## 3. Instruções de Codificação (Front-end)

### Tarefa 3.1: Inicialização e Consentimento (LGPD)
Sempre que for criar ou modificar o arquivo raiz (`layout.tsx` no Next.js ou `index.html` no React puro), você DEVE injetar o script de estado padrão do Consent Mode ANTES do script do GTM. 

O estado padrão deve ser obrigatoriamente este:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
```

### Tarefa 3.2: Função Utilitária Global
Implemente (caso não exista) uma função centralizada para o disparo de eventos, garantindo a tipagem de segurança se estiver usando TypeScript.

```javascript
// src/utils/tracking.js ou .ts
export const trackEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...data
    });
  }
};
```

### Tarefa 3.3: Instrumentação de Componentes
Quando solicitado para adicionar rastreamento a um componente de UI (formulário, botão de checkout, onboarding), chame a função `trackEvent` injetando as variáveis correspondentes disponíveis no estado (state) ou nas propriedades (props) do componente.

## 4. Instruções de Configuração (GTM Web)
Quando o usuário solicitar o mapeamento das tags no painel, forneça o guia passo a passo da seguinte maneira:

1. **Variáveis:** Instrua a criação de `Variáveis da Camada de Dados` para cada chave enviada no objeto do evento.
2. **Acionadores:** Instrua a criação de um Acionador do tipo `Evento Personalizado` com o nome exato do disparo definido no código.
3. **Tags (Encaminhamento):** - Tipo: `Google Analytics: evento do GA4`.
   - A Tag DEVE conter o parâmetro de configuração `server_container_url` apontando para a URL do sGTM.
   - A Tag DEVE exigir consentimento (ex: `analytics_storage` ou `ad_storage`) nas Configurações Avançadas > Configurações de Consentimento.

## 5. Regras de Ouro (Restrições do Agente)
- **NUNCA** sugira disparos baseados em cliques de classes CSS (`gtm.click`). Todo rastreamento deve ser orientado a dados explícitos via `window.dataLayer.push()`.
- **NUNCA** injete pixels de terceiros (Meta, TikTok, etc.) diretamente no código-fonte do React. O roteamento de pixels é responsabilidade exclusiva do GTM Server.
- Em casos de domínios compartilhados (institucional vs. área logada), instrua o uso da variável nativa `Page Hostname` no GTM Web para bloquear tags de remarketing dentro das rotas internas da aplicação (ex: bloquear Meta Pixel em `app.seudominio.com.br`).