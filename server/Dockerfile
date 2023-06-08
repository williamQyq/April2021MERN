FROM node:alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app/
# ADD config /app/config
# COPY .env /app

EXPOSE 5000

CMD ["npm","run", "server:prod"]

