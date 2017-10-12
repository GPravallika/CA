if [[ $# -eq 0 ]]; then
    echo "Running rapido using 2 containers (rapido-web, rapido-backend) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose.yml pull
    docker-compose -f docker-compose.yml up
elif [[ $1 = "stage" ]]; then
    echo "Running rapido using 3 containers (rapido-web, rapido-backend, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-stage.yml pull
    docker-compose -f docker-compose-stage.yml up
else
    echo "Invalid run argument $1 ..."
    echo "Only valid argument is 'stage'";
fi
