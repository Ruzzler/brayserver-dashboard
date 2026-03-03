# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 2: Build the production Node backend
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --production

# Copy backend logic
COPY server.js ./

# Pre-create config.json if it doesn't exist so Unraid can map it cleanly.
# If Unraid maps a file here, this gets overwritten by the volume mount.
COPY config.json ./

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000
CMD ["node", "server.js"]
