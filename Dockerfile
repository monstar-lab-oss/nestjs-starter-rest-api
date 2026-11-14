# Development Dockerfile
FROM node:26.13.1-trixie-slim

# Install additional tools for development
RUN apt-get update && apt-get install -y \
  vim \
  curl \
  wget \
  git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Node.js 25+ no longer bundles Corepack, so install pnpm explicitly.
# Keep this in sync with "devEngines.packageManager" in package.json.
ARG PNPM_VERSION=12.18.0
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app

# Copy and install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Set the environment variables
ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

# Expose the application port
EXPOSE 3000

# Run the application in watch mode
CMD ["pnpm", "start:dev"]
