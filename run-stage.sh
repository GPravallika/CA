echo "Runing rapido from stage using 3 containers ..."
docker-compose -f docker-compose-stage.yml pull
docker-compose -f docker-compose-stage.yml up
