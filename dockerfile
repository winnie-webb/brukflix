# Use Node.js 18 image
FROM node:18

# Install dependencies required by Puppeteer and Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libxcomposite1 libxrandr2 libgbm1 xdg-utils \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg \
    fonts-kacst --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port your app will run on
EXPOSE 8000

# Start the app in production mode
CMD ["npm", "run", "start"]
