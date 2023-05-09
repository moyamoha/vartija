FROM node:alpine

WORKDIR /app/nestjs

EXPOSE 5000
COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prod"]
