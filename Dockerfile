FROM node:lts-alpine3.23

WORKDIR /app

COPY src/package*.json ./

RUN npm install

COPY src/ .

EXPOSE 3000

CMD ["npx", "nodemon", "app.js"]