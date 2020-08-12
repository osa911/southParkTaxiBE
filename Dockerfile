FROM node:12.18.3

RUN mkdir /app
WORKDIR /app

EXPOSE 5085

RUN npm install node-pre-gyp -g
COPY package.json /app
COPY yarn.lock /app
COPY prisma /app/prisma/
COPY src /app/src/
COPY babel.config.js /app/
COPY localServer.js /app/
COPY nodemon.json /app/
RUN yarn install --non-interactive --frozen-lockfile
RUN yarn prisma

CMD ["yarn", "server"]
