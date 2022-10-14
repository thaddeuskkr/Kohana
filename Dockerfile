FROM node:latest
# Use the latest node.js version
WORKDIR /kohana
# Set the working directory
COPY package*.json ./
# Copy package.json and package-lock.json to the working directory
RUN npm install
# Install required dependencies
COPY . .
# Copy all files to the working directory
# EXPOSE 6969
# Expose ports for API (Not yet implemented)
CMD [ "node", "." ]