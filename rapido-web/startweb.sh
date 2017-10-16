apiserver=${RAPIDO_BACKEND:-localhost:9001}
echo "Rapido backend is $apiserver"
sed -i -e "s/@RAPIDO_BACKEND@/${apiserver}/g" ./build/rapido-web.js && node index.js
