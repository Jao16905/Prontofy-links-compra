# ==========================================
# 1. ESTÁGIO DE BUILD (Node.js)
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./
RUN npm ci

# Copia o restante do código
COPY . .

# ---------------------------------------------------
# DECLARAÇÃO DOS ARGUMENTOS (Recebidos do GitHub Actions)
# ---------------------------------------------------
ARG VITE_N8N_WEBHOOK_URL
ARG VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY
ARG VITE_SUPABASE_MARKETING_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_URL

# ---------------------------------------------------
# ATIVAÇÃO DAS VARIÁVEIS (Disponibiliza para o Vite)
# ---------------------------------------------------
ENV VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL
ENV VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY=$VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY
ENV VITE_SUPABASE_MARKETING_URL=$VITE_SUPABASE_MARKETING_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

# O processo de build do React vai ler as variáveis acima e embutir no JS
RUN npm run build

# ==========================================
# 2. ESTÁGIO DE PRODUÇÃO (Nginx)
# ==========================================
FROM nginx:alpine AS runner

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados (HTML/JS/CSS) para a pasta do Nginx
# Se estiver usando Create React App, troque 'dist' por 'build'
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração para o React Router funcionar corretamente (evita erro 404)
RUN echo -e 'server {\n\
  listen 80;\n\
  location / {\n\
      root /usr/share/nginx/html;\n\
      index index.html index.htm;\n\
      try_files $uri $uri/ /index.html;\n\
  }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
