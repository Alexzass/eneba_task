FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production=true

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]