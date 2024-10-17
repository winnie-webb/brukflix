# Use the official Node.js image with version 18
FROM node:18

# Install additional dependencies required by Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libxcomposite1 libxrandr2 libgbm1 xdg-utils \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg \
    fonts-kacst ttf-freefont --no-install-recommends

# Set environment variable to skip Chromium installation issues
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create app directory and copy project files
WORKDIR /usr/src/app
COPY package*.json ./

# Install Node dependencies (including Puppeteer)
RUN npm install

# Copy remaining files
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start"]
