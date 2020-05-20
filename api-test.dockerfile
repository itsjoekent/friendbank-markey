FROM node:12-stretch

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# RUN npm run build:webpack

CMD ["npm", "run", "start:api"]
