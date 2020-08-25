FROM node:12-alpine as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

RUN npm run build

RUN npm prune

FROM node:12-alpine

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

USER node
CMD [ "npm", "run", "start:prod" ]
