FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/var/lib/pet-routine/pet-routine.db

WORKDIR /app

RUN mkdir -p /var/lib/pet-routine && chown node:node /var/lib/pet-routine

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
VOLUME ["/var/lib/pet-routine"]

USER node

CMD ["npm", "run", "start:prod"]
