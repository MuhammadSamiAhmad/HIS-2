# Use the official Node.js image from Docker Hub, specifically Node.js version 20.
# This serves as the base image for our container, ensuring we have a Node.js runtime environment.
FROM node:20-alpine3.18

# Set the working directory inside the container to /app.
# All subsequent commands will be executed in this directory.
WORKDIR /app

# Copy the package.json and package-lock.json (if it exists) into the working directory.
# These files contain the project's dependencies, which we need to install.
COPY package*.json ./

# Install all the Node.js dependencies listed in package.json.
# This command runs `npm install` to set up the environment for the project.
RUN npm install

# Copy the Prisma folder into the container.
# Prisma contains the schema and configurations needed to generate database client code.
COPY prisma ./prisma

# Run Prisma's generate command to create the Prisma client.
# The client is used to interact with the database in the Node.js application.
RUN npx prisma generate

# Copy all the other project files from the host machine into the container's /app directory.
# This includes source code and any other assets needed for the app to run.
COPY . .

# Expose port 4000 to allow the container to communicate on this port.
# This is the port where our Node.js server will listen for requests.
EXPOSE 8000

# Define the command to start the application.
# This will execute `node server.js` to run the server when the container starts.
CMD ["node", "server.js"]
