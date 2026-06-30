# Use the official Node.js image
FROM node:18-alpine

# Set the working directory to the frontend folder
WORKDIR /app

# Copy package files from the frontend folder
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy all project files from the frontend folder
COPY frontend/ .

# Build the project
RUN npm run build

# Install a simple web server
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist"]