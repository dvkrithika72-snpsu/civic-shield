# Use the official Node.js image
FROM node:18-alpine

# Set the working directory to the frontend folder
WORKDIR /app

# Copy package files from the frontend folder
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy all project files from the frontend folder to the container
COPY frontend/ .

# Build the project
RUN npm run build

# Install a simple web server
RUN npm install -g serve

# Expose the default port (Cloud Run will override this with the PORT environment variable)
EXPOSE 8080

# Start the server, binding to the PORT environment variable (default 8080)
CMD ["sh", "-c", "serve -s dist -l ${PORT:-8080}"]