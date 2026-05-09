FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ─── Production image ────────────────────────────────────────────────────────
FROM node:20-alpine

# Run as non-root user for security
RUN addgroup -S solver && adduser -S solver -G solver

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# config.json must be mounted at runtime (not baked into the image)
VOLUME ["/app/config.json"]

USER solver

CMD ["node", "dist/index.js"]
