FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

EXPOSE 34003

CMD ["npm", "start"]