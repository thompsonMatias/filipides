# Image
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install global dependencies
RUN npm install -g forever

# Copy project files
COPY ./server ./server
COPY ./client ./client
COPY ./package.json .

# Install app dependencies
WORKDIR /usr/src/app
RUN npm run i

# Compile webapp
WORKDIR /usr/src/app
RUN npm run build

# Webapp to server
WORKDIR /usr/src/app
RUN rm -rf ./server/src/app/public
RUN mv ./client/build/ ./server/src/app/public/

# Init server
CMD ["yarn", "run", "start"]
