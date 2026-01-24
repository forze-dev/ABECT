FROM node:22.17.0-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat

# deps
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
