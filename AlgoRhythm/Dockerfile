FROM node:20 AS build
WORKDIR /app

# Copy package files - leverage caching
COPY package.json ./

# Reinstall dependencies from scratch for Linux
RUN npm install --ignore-scripts

# Copy the rest of the app
COPY . .

# Build
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]