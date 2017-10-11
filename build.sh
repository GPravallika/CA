docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-db" rapido-db
docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-web" rapido-web
docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-backend" rapido-backend

docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-db
docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-web
docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-backend
