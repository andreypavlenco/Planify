FROM node:22.11.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN  npm ci

COPY . .

RUN npm run build

FROM node:22.11.0-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/src/database/data-source.js ./data-source.js

COPY tsconfig.json .
COPY src ./src

RUN npm install -g ts-node

CMD ["sh", "-c", "npx typeorm migration:run -d dist/src/database/data-source.js && node dist/src/main.js"]
