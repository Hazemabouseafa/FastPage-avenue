FROM nginx:alpine

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static website assets
COPY . /usr/share/nginx/html

# Expose HTTP port for Coolify / Traefik
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
