FROM node:alpine

WORKDIR /books

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "docker"]
