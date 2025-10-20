# ===== ETAPA DE CONSTRUCCIÓN =====

# Use a Node.js base image
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (use npm ci for clean installs in CI/CD)
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build the NestJS application
RUN npm run build

# ===== ETAPA DE PRODUCCIÓN =====
FROM node:22-alpine

WORKDIR /usr/src/app

# Copia solo lo necesario para producción
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Variables de entorno (se sobrescriben en docker-compose)
ENV NODE_ENV=production
ENV PORT=3006

EXPOSE 3006

CMD ["node", "dist/src/main.js"]

# Health check para Render
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3006/health || exit 1