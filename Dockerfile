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

# 1. Resolver problema del PID 1: Instalamos tini para gestionar señales del sistema (SIGTERM, SIGINT)
RUN apk add --no-cache tini

WORKDIR /app
ENV NODE_ENV=production

# 2. Seguridad: Damos propiedad del entorno de trabajo al usuario "node" nativo de la imagen
RUN chown -R node:node /app
USER node

# Copiamos asignando propiedad a nuestro usuario "node"
COPY --chown=node:node package*.json ./

# Instalamos únicamente dependencias de producción
RUN npm ci --omit=dev

# Copiamos la compilación limpia del builder con los permisos correctos
COPY --chown=node:node --from=builder /app/dist ./dist

USER root
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
USER node

ENV PORT=3000
EXPOSE 3000

# Arrancamos la aplicación envuelta delegando el PID 1 a tini, conectando en cascada con Node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/app.js"]
