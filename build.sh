show_usage()
{
    echo "Invalid build arguments ..."
    echo "Usage ./build.sh <project-name>|all [deploy]"
    echo "Examples :"
    echo "1) ./build.sh rapido-web deploy"
    echo "2) ./build.sh rapido-backend"
    echo "3) ./build.sh all deploy"
    echo "1) ./build.sh all"
    echo ""
}

echo ""
echo "********************************"
echo "Running build script for rapido"
echo "********************************"
echo ""


if [[ $# -eq 2 ]]; then

    if [[ ($1 = "rapido-db" || $1 = "rapido-web"  || $1 = "rapido-backend") && $2 = "deploy" ]] ; then
        echo ""
        echo "--------------------------------"
        echo "Building $1 ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/$1" $1
        echo ""
        echo "--------------------------------"
        echo "Deploying the $1 contaier to repo ..."
        echo "--------------------------------"
        echo ""
        docker push isl-dsdc.ca.com:5000/apim-solutions/$1
    elif [[ $1 = "all"  && $2 = "deploy" ]]; then
        echo ""
        echo "--------------------------------"
        echo "Building all rapido projects ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-db" rapido-db
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-web" rapido-web
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-backend" rapido-backend

        echo ""
        echo "--------------------------------"
        echo "Deploying all containers to repo ..."
        echo "--------------------------------"
        echo ""
        docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-db
        docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-web
        docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-backend
    else
        show_usage
    fi
elif [[ $# -eq 1 ]]; then
    if [[ $1 = "rapido-db" || $1 = "rapido-web"  || $1 = "rapido-backend" ]] ; then
        echo ""
        echo "--------------------------------"
        echo "Building $1 ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/$1" $1
    elif [[ $1 = "all" ]] ; then
        echo ""
        echo "--------------------------------"
        echo "Building all rapido projects ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-db" rapido-db
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-web" rapido-web
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-backend" rapido-backend
    else
        show_usage
    fi
else
    show_usage
fi
