# --- STAGE 1: Build the React Application ---
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build # Tworzy skompilowane pliki w /app/dist

# --- STAGE 2: Serve the Static Files with Nginx ---
FROM nginx:stable-alpine AS final
# Kopiujemy skompilowane pliki z fazy 'build' do domyślnego katalogu Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]