FROM node:16.14.0

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 5443

CMD [ "node", "app.js" ]