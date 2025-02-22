FROM node:12.22.0-buster

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY ./start.sh /

RUN npm install

# Bundle app source
COPY . .

ENTRYPOINT ["/start.sh"]