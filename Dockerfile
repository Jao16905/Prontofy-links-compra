# ==========================================
# 1. ESTÁGIO DE BUILD (Node.js)
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./
RUN npm ci

# Copia o restante do código (INCLUINDO o .env.production gerado pelo GitHub Actions)
COPY . .

# O processo de build do React via Vite vai ler o .env.production automaticamente
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
