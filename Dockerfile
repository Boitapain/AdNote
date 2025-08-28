FROM node:20-alpine AS builder
WORKDIR /app

# build args pour les PUBLIC_* nécessaires au build SvelteKit
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG DATABASE_URL

# rendre disponibles pendant le build (Vite / SvelteKit lit process.env au build)
ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}
ENV DATABASE_URL=${DATABASE_URL}

# Installer les dépendances (utilise package-lock si présent)
COPY package*.json ./
RUN npm ci --silent

# Copier le projet et builder
COPY . .
RUN npm run build

# image finale
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache ca-certificates

ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG DATABASE_URL

ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}
ENV DATABASE_URL=${DATABASE_URL}

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]