FROM node:16

WORKDIR /app

COPY client/package.json client/
COPY server/package.json server/

RUN yarn --production --cwd client install
RUN yarn --production --cwd server install

COPY . .

RUN yarn --cwd client build

EXPOSE 4000
 
CMD [ "node", "server/src/index.js" ]