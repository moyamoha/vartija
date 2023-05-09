FROM node:alpine

WORKDIR /app/nestjs

EXPOSE 5000
COPY . .

RUN npm run install
RUN npm run build

CMD ["npm", "run", "start:prod"]
