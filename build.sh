if [[ $1 = "rapido-db" || $1 = "rapido-web"  || $1 = "rapido-backend" ]] ; then
    echo "Building $1 ..."
    echo "--------------------------------"
    echo ""
    docker build -t "isl-dsdc.ca.com:5000/apim-solutions/$1" $1
    docker push isl-dsdc.ca.com:5000/apim-solutions/$1
elif [[ $1 = "all" ]]; then
    echo "Building all rapido projects ..."
    echo "--------------------------------"
    echo ""
    docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-db" rapido-db
    docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-web" rapido-web
    docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-backend" rapido-backend

    docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-db
    docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-web
    docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-backend
else
    echo "Invalid build arguments ..."
    echo "Usage ./build.sh <project-name>|all"
fi
