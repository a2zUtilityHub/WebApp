# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set build-time variables for Supabase
# These should be passed during the build process, e.g.,
# docker build --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_ANON_KEY=... -t my-app .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# When running this container, you should mount your custom nginx.conf
# to /etc/nginx/nginx.conf
# e.g., -v ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]