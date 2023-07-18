FROM node:alpine

WORKDIR /app

# Copy package.json to the container's /app/server directory
COPY ./server/package.json /app/server/
# Install dependencies in the /app/server directory
RUN cd /app/server && npm install

COPY ./server /app/server/
ADD ./server/config /app/server/config

# Secrete keys
COPY ./server/.env /app/server/

# client web built content
COPY ./mern-project/build /app/mern-project/build

# 5000 api server, 5050 websocket server
EXPOSE 5000 5050

WORKDIR /app/server
CMD ["npm","run", "server:prod"]

