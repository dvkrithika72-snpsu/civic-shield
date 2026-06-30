# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Build the frontend
COPY frontend/ .
RUN npm run build

# Stage 2: Setup Python backend
FROM python:3.11-slim
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend/ .

# Copy the built frontend static files from the builder stage
# We place them in the 'dist' directory where app.py expects them
COPY --from=frontend-builder /app/frontend/dist /app/dist

# Expose the port (Cloud Run uses the PORT environment variable, defaults to 8080)
EXPOSE 8080

# Start the FastAPI server on the designated PORT
CMD uvicorn app:app --host 0.0.0.0 --port ${PORT:-8080}