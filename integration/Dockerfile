FROM node:18-slim
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
CMD ["node", "main.js"]