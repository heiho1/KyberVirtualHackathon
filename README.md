# [Welcome to DeFiZap](https://defizap.com)

## Development
The following code can be run locally by running the following two commands.

1. `yarn install`
2. `yarn start`

on the root level of the directory.

## Docker 
The code can also be run using the Dockerfile.  First you must install Docker for your host operating system from the resources at [Docker|https://www.docker.com/].

With docker running you can build an image and run a container from that image:

0. Using a command line terminal, change into the KyberVirtualHackathon root directory
<<<<<<< HEAD
1. `docker build -t defistrategies .`
2. "docker run -p 3000:3000 defistrategies:latest `cd /opt/app; yarn start`"
3. Execute `docker stop` in another terminal to stop the docker container.
=======
1. Run `docker-compose up --build` (this will build the image based on the dockerFile and then start it as per the instructions provided in the docker-compose.yml)
2. Once it is up use this command to connect to the shell `docker exec -it [TO INSERT DOCKER CONTAINDER ID] /bin/sh -c "[ -e /bin/bash ] && /bin/bash || /bin/sh`.  Here you will be able to do any NPM install that you may require.
3. To close use `CTRL+C` in the terminal in which docker container was initiated
4. 
>>>>>>> 91014b62bfbc5ef46f5dcec82c2016c92c6074bb

At this point the react server will start and you will be able to access http://localhost:3000 in any browser on your host operating system.