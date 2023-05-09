FROM node:lts

# Create app directory
WORKDIR /vartija
COPY package*.json ./
RUN npm run install
COPY . .

EXPOSE 5000

RUN npm run build
CMD [ "npm", "run", "start:prod" ]