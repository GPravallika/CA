echo "Rapido backend is $RAPIDO_BACKEND"
apiserver=${RAPIDO_BACKEND:-localhost:9001}
sed -i -e "s/@RAPIDO_BACKEND@/${apiserver}/g" ./build/rapido-web.js && node index.js
