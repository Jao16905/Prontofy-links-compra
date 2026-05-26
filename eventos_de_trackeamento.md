# Eventos de Trackeamento

Este documento lista todos os eventos de trackeamento implementados no projeto, quais dados eles enviam via `dataLayer` e onde no código eles são disparados.

A função principal utilizada para o envio de eventos é a `trackEvent`, localizada em `src/utils/track.ts`.

---

## 1. Evento: `contact_submit`

Disparado após o envio bem-sucedido de informações do formulário de contato (lead) para o Webhook.

*   **Arquivo/Componente:** `src/pages/FormularioLeads.tsx`
*   **Ação:** Envio com sucesso do formulário.

**Parâmetros (Payload enviados.dataLayer):**
```json
{
  "event": "contact_submit",
  "location": "lead_form",
  "form": "presentation_request"
}
```

---

## 2. Evento: `cta_click` (Hero - Scroll para de vídeo)

Disparado quando o usuário clica no primeiro botão CTA da página inicial para visualizar o vídeo de apresentação.

*   **Arquivo/Componente:** `src/components/TemporaryHero.tsx`
*   **Ação:** Clique no botão de CTA "Quero evoluir minha gestão".

**Parâmetros (Payload enviados.dataLayer):**
```json
{
  "event": "cta_click",
  "location": "hero",
  "button_text": "Quero evoluir minha gestão",
  "action": "scroll_to_video"
}
```

---

## 3. Evento: `cta_click` (Abertura do WhatsApp)

Disparado quando o usuário clica no botão abaixo do vídeo, que direciona para atendimento pelo WhatsApp.

*   **Arquivo/Componente:** `src/components/TemporaryHero.tsx`
*   **Ação:** Clique no botão "Quero agendar minha apresentação".

**Parâmetros (Payload enviados.dataLayer):**
```json
{
  "event": "cta_click",
  "location": "presentation_video",
  "button_text": "Quero agendar minha apresentação",
  "action": "open_whatsapp"
}
```

---

## 4. Evento: `cta_click` (Feature Card)

Disparado quando o usuário clica no botão de link/ação de um dos cartões de funcionalidades (`FeatureCard`).

*   **Arquivo/Componente:** `src/components/FeatureCard.tsx`
*   **Ação:** Clique no botão/cartão de funcionalidade.

**Parâmetros (Payload enviados.dataLayer):**
```json
{
  "event": "cta_click",
  "location": "feature_card",
  "button_text": "[Texto da Prop buttonText do Componente]",
  "feature_title": "[Texto da Prop title do Componente]"
}
```

---

## 5. Evento Específico: Configuração de Consentimento (gtag)

Existe uma função para configurar permissões baseadas em políticas de privacidade e cookies (Consent Mode).

*   **Arquivo:** `src/utils/track.ts` (Função `updateConsent`)
*   **Descrição:** Atualiza as permissões de `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` enviando "granted" ou "denied" através do Google Global Site Tag (`window.gtag('consent', 'update')`).
