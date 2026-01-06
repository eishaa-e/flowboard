# Use Node 24 (or latest LTS if 24 is not available, but per spec we use 24)
FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
