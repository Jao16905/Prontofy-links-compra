# ==========================================
# 1. ESTÁGIO DE BUILD (Node.js)
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

# 1. Declara que o Docker deve esperar esses argumentos no build
ARG VITE_SUPABASE_MARKETING_URL
ARG VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY

# 2. Transforma os argumentos em variáveis de ambiente para o Vite usar
ENV VITE_SUPABASE_MARKETING_URL=$VITE_SUPABASE_MARKETING_URL
ENV VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY=$VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Agora o Vite vai enxergar as variáveis injetadas
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
