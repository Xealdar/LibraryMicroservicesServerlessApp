FROM node:alpine

WORKDIR /customers

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 5555

CMD ["yarn", "run", "docker"]