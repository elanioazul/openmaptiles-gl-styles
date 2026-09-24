# STAGE 1: Base
FROM node:20-alpine AS base
RUN apk add --no-cache docker-cli bash
WORKDIR /usr/src/app

# STAGE 2: Development
FROM base AS development
# Copy package files first to leverage Docker cache
COPY package*.json ./
# Install all dependencies (including devDependencies)
RUN npm install
# Copy source code
COPY . .
# The build is needed for some decorators/metadata in Nest
RUN npm run build

# STAGE 3: Production Build
FROM base AS build
COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev
COPY . .
RUN npm run build

# STAGE 4: Production Run
FROM node:20-alpine AS production
WORKDIR /usr/src/app
RUN apk add --no-cache docker-cli
# Copy only the necessary files from build stages
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3001
CMD ["npm", "run", "start:prod"]