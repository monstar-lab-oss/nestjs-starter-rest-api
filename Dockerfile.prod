# Stage 1: Build the application
FROM node:20.14.0-bookworm-slim as builder

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}
RUN npm run build

# Prune development dependencies
RUN npm prune --production

# Stage 2: Create the production image
FROM node:20.14.0-bookworm-slim

WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Set the environment variables
ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

# Expose the application port
EXPOSE 3000

# Use a non-root user for security
USER node

# Set the default command to run the application
CMD [ "npm", "run", "start:prod" ]
