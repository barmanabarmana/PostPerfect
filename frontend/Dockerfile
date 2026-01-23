# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./
RUN npm ci

# Copy source
COPY frontend/ .

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build with environment variable
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration from frontend directory
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom entrypoint scripts
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
COPY frontend/inject-env.sh /inject-env.sh
RUN chmod +x /docker-entrypoint.sh /inject-env.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
