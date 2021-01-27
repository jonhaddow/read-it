FROM node:14-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3000

CMD [ "node", "dist/src/server.js" ]

