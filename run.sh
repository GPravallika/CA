if [[ $# -eq 0 ]]; then
    echo "Pulling 2 rapido containers (rapido-web, rapido-backend) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose.yml pull
    echo "Running rapido using 2 containers (rapido-web, rapido-backend) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose.yml up
elif [[ $1 = "stage" ]]; then
    echo "Pulling 3 rapido containers (rapido-web, rapido-backend, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-local.yml pull
    echo "Running rapido using 3 containers (rapido-web, rapido-backend, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-local.yml up
elif [[ $1 = "local" ]]; then
    echo "Running rapido using 3 containers (rapido-web, rapido-backend, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-local.yml up
else
    echo ""
    echo "Invalid run.sh argument $1 ..."
    echo "Valid arguments are 'stage'|'local'"
    echo ""
fi
