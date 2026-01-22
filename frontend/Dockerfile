# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY frontend/ .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration from frontend directory
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
