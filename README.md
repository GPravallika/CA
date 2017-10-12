# rapido
A project for graphically designing restful apis.

[rapido-web](rapido-web) : is a the frontend project written in React js for all UX and sketching stuffs.
[rapido-backend](rapido-backend) : is a nodejs http api server which serves the apis required for the Sketching etc
[rapido-db](rapido-db) : is just a docker container for postgress database, which can be leveraged in case user does not have a separate persistence.

### Building and running the application
``
./build.sh <project-name> | all
``

The above command builds one or more docker container and pushes them to docker registry 
<b>isl-dsdc.ca.com:5000/apim-solutions</b>

If you wish to run with the persistence container you could do that using

``
./run.sh stage
``

If you wish to run the application with your own postgres database, make sure you run the schema from [init.sql](rapido-db/init.sql) and then set the db credentials in your environment variables and run as below

``
DB_HOST
DB_PORT
DB_USER
DB_SCHEMA
DB_PASSWORD

./run.sh
``
