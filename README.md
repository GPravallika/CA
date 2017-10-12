# rapido
A project for graphically designing restful apis.

[rapido-web](rapido-web) : is a the frontend project written in React js for all UX and sketching stuffs.

[rapido-backend](rapido-backend) : is a nodejs http api server which serves the apis required for the Sketching etc

[rapido-db](rapido-db) : is just a docker container for postgress database, which can be leveraged in case user does not have a separate persistence.

## Building and running the application
Prerequisite :
1. Nodejs
2. docker
3. docker compose
Usage :
``
./build.sh <project-name>|all [deploy]
``

Examples :
1) ./build.sh rapido-web deploy
2) ./build.sh rapido-backend
3) ./build.sh all deploy
1) ./build.sh all

The above command builds one or more docker container and pushes them to docker registry
<b>isl-dsdc.ca.com:5000/apim-solutions</b>

### Running the application
- If you wish to run the application from locally built containers with own persistence database :

Set the below environment variables and run the schema from [init.sql](rapido-db/init.sql). Then use run command as below.

DB_HOST
DB_PORT
DB_USER
DB_SCHEMA
DB_PASSWORD

``
docker-compose -f docker-compose.yml up
``
- If you wish to run the application from locally built containers using database in a container

``
docker-compose -f docker-compose-stage.yml up
``

- If you wish to pull from repo and run with the persistence container you could do that using

``
./run.sh stage
``

- If you wish to pull from repo and run the application with your own postgres database, make sure you run the schema from [init.sql](rapido-db/init.sql) and then set the db credentials in your environment variables and run as below

DB_HOST

DB_PORT

DB_USER

DB_SCHEMA

DB_PASSWORD

``
./run.sh
``
