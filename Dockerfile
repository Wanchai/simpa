FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

ARG SIMPA_ADDRESS
ENV SIMPA_ADDRESS $SIMPA_ADDRESS

RUN npm run build \
    && npm prune --production

# ---

FROM node:20-alpine

ENV NODE_ENV development

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

RUN mkdir data && touch simpa.db && cp -n ./simpa.db ./data/simpa.db

COPY --from=builder --chown=node:node /home/node/views/ ./views/
COPY --from=builder --chown=node:node /home/node/public/ ./public/

RUN npm run migration:run:prod

EXPOSE 3000

CMD ["node", "dist/main.js"]