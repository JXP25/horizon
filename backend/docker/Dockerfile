# Start from a lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your code
COPY . .

# Build your TypeScript
RUN pnpm run build

# Expose your API port
EXPOSE 4001

# Run the server
CMD ["node", "build/index.js"]
