# Development Dockerfile
FROM node:20.14.0-bookworm-slim

# Install additional tools for development
RUN apt-get update && apt-get install -y \
  vim \
  curl \
  wget \
  git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Set the environment variables
ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

# Expose the application port
EXPOSE 3000

# Set the default command to run the application with nodemon
CMD ["npm", "start:dev"]
