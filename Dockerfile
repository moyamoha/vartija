FROM node:lts

WORKDIR /vartija-backend

COPY package*.json ./
RUN npm run install
COPY . .

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start:prod"]
