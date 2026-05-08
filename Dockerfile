# ── Stage 1: Build the Vite/React client ────────────────────────────────────
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY Client/package*.json ./
RUN npm ci
COPY Client/ ./
RUN npm run build

# ── Stage 2: Build the Express/TypeScript server ────────────────────────────
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY Server/package*.json ./
RUN npm ci
COPY Server/ ./
RUN npm run build

# ── Stage 3: Final image ────────────────────────────────────────────────────
FROM node:20-alpine

# Install nginx
RUN apk add --no-cache nginx

# Server runtime deps only
WORKDIR /app/server
COPY Server/package*.json ./
RUN npm ci --omit=dev

# Copy built server
COPY --from=server-builder /app/server/dist ./dist

# Copy SQL migrations (not compiled by tsc)
COPY Server/src/db/migrations ./dist/db/migrations

# Copy built client to nginx web root
COPY --from=client-builder /app/client/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
