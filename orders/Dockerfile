FROM node:alpine

WORKDIR /orders

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 7777

CMD ["yarn", "run", "docker"]