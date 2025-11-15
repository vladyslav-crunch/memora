# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install required system libs for sharp
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    build-base \
    bash \
    curl \
    ca-certificates

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install required libs for sharp (runtime only)
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    bash \
    curl \
    ca-certificates

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
