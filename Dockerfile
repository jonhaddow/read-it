FROM node:14.15-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npx tsc

ENV PORT 80
EXPOSE 80

CMD [ "node", "dist/src/server.js" ]

