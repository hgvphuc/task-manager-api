# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install              # installs ALL deps, including dev ones

COPY . .
RUN npm run build            # e.g. compiles TypeScript, bundles, etc.

# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev   # only production dependencies

# Copy ONLY the compiled output from the builder stage — not source, not dev tools
COPY --from=builder /app/dist ./dist

# Node's official image already includes a non-root user called "node"
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]