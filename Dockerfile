#standalone container
FROM node:20 as dev

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build

# CMD [ "npm", "run", "start:dev" ]
CMD [ "npm", "start" ]


# common container
FROM node:20 as prod

WORKDIR /coffeedoor-order-microservice

COPY ./coffeedoor-order-microservice/package.json /coffeedoor-order-microservice
COPY ./coffeedoor-order-microservice/package-lock.json /coffeedoor-order-microservice
COPY ./coffeedoor-order-microservice/tsconfig.json tsconfig.json
COPY ./coffeedoor-order-microservice/nest-cli.json nest-cli.json

RUN npm install

COPY /coffeedoor-order-microservice /coffeedoor-order-microservice

RUN npm run build

CMD [ "npm", "start" ]
