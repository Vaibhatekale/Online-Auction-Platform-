# Base image
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the project files
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
