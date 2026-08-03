# --- Этап 1: Сборка статики Vue ---
  FROM node:22-alpine AS builder
  WORKDIR /app
  
  # Копируем файлы зависимостей и устанавливаем их
  COPY package*.json ./
  RUN npm ci
  
  # Копируем исходный код проекта и собираем production-версию
  COPY . .
  RUN npm run build
  
  # --- Этап 2: Раздача через Nginx ---
  FROM nginx:1.25-alpine
  
  # Копируем скомпилированную статику Vue в папку, откуда её читает Nginx
  COPY --from=builder /app/dist /usr/share/nginx/html
  
  # Копируем наш кастомный конфиг Nginx для поддержки Vue Router (см. примечание ниже)
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  