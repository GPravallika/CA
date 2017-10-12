# rapido
A project for graphically designing restful apis.

[rapido-web](rapido-web) : is a the frontend project written in React js for all UX and sketching stuffs.

[rapido-backend](rapido-backend) : is a nodejs http api server which serves the apis required for the Sketching etc

[rapido-db](rapido-db) : is just a docker container for postgres database, with rapido schemas, which can be leveraged for persistence.

## Build the application
If you just wish to run the application from already built containers located at <b>isl-dsdc.ca.com:5000/apim-solutions</b>, skip to Run the application section.


Prerequisite :
1. docker
2. docker compose
Usage :
``
./build.sh <project-name>|all [deploy]
``

Examples :
- ./build.sh rapido-web
- ./build.sh rapido-backend push
- ./build.sh all
- ./build.sh all push

The above command builds one or more docker container and pushes (if supplied as argument) them to docker registry

<b>isl-dsdc.ca.com:5000/apim-solutions</b>

## Run the application
Rapido is docker containerized application. Current development is already staged at <b>isl-dsdc.ca.com:5000/apim-solutions</b>. In order to run, you could either build all the containers as mentioned in the above section or you could download them from stage repository.

### Locally built containers
Since, you have built the containers, you could just run them using docker compose file [docker-compose-local.yml](docker-compose-local.yml)
Alternatively ( read: easy way ),

``
./run.sh local
``
### From staged containers
- If you don't want to get into the bread and potatoes of the container building. You could just pull the images using [docker-compose-local.yml](docker-compose-local.yml) and run.
Alternatively (yes, easy!)

``
./run.sh stage
``

### For development purpose

- [rapido-web](rapido-web) is a React js application, which leverages webpack for development purpose and uses a slim node http server to server the SPA in production mode. To run the app in development mode, please modify the [ApiServices.jsx](rapido-web/src/modules/utils/ApiServices.jsx) to point to the backend instance and run

``
npm install
npm run dev
``

- Prepare the database using schema from [init.sql](rapido-db/init.sql)

- [rapido-backend](rapido-backend) is a standard express based node application. And hence, can be run using standard node conventions. Note, you may want to override below environment variables before running

``
npm install
npm start
``
Environment variables :

DB_HOST
DB_PORT
DB_USER
DB_SCHEMA
DB_PASSWORD

### For Production purpose

Production mode uses RDS as persistence layer. Please set the appropriate environment variables mentioned in [docker-compose.yml](docker-compose.yml) and

``
./run.sh
``
