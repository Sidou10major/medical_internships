# Use official Node.js LTS
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
