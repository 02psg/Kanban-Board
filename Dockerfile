FROM node:18-alpine

WORKDIR /src

COPY . .

RUN npm install

CMD ["npm", "start"]


