FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY package-lock.json /app

RUN npm install

# Bundle app source
COPY . /app

# Build the app
RUN npm run build

# CMD [ "npm", "run", "start:dev" ]
CMD [ "npm", "start" ]
