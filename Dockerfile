# ==========================================
# 1. Base Stage
# ==========================================
FROM node:22-alpine AS base
WORKDIR /app
# Variables de entorno por defecto (se pueden sobrescribir)
ENV NODE_ENV=development

# Instalamos curl y dependencias nativas mínimas por si el stack requiere compilar algo (ej. bcrypt, sqlite)
RUN apk add --no-cache curl python3 make g++

# Copiamos archivos de dependencias
COPY package*.json ./

# ==========================================
# 2. Development Stage
# ==========================================
FROM base AS development
# En la etapa de desarrollo necesitamos todo para poder usar nodemon, ts-node, jest, etc.
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Exponemos el puerto de la app
EXPOSE 3000

# El comando por defecto cuando se arranca en desarrollo (se usarán volúmenes externamente en docker-compose)
CMD ["npm", "run", "serve"]

# ==========================================
# 3. Builder Stage (Compilador)
# ==========================================
FROM base AS builder
# Necesitamos la carpeta node_modules generada en la etapa de dependencias full
RUN npm ci

# Copiamos el código
COPY . .

# Generamos la carpeta dist con webpack/tsc compilado a puro JS
RUN npm run build

# ==========================================
# 4. Production Stage
# ==========================================
FROM node:22-alpine AS production
WORKDIR /app
# Seteamos estrictamente a producción
ENV NODE_ENV=production

# Copiamos solo el package.json para resolver dependencias de prod
COPY package*.json ./

# Instalamos únicamente dependencias de producción (--omit=dev evita eslint, typescript, nodemon, etc.)
RUN npm ci --omit=dev

# Copiamos la compilación limpia del builder
COPY --from=builder /app/dist ./dist

# Para entornos que no sean cloud, exponemos un puerto explícitamente (Railway inyectará PORT a fuego)
ENV PORT=3000
EXPOSE 3000

# Arrancamos con Node nativo sumamente rápido y sin consumo extra
CMD ["node", "dist/app.js"]
