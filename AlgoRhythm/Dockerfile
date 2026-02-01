# --- STAGE 1: Build the React Application ---
FROM node:20-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build # Built files in /app/dist

# --- STAGE 2: Serve the static files with Nginx ---
FROM nginx:stable-alpine AS final

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy shell script to set envs
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Entry point
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]