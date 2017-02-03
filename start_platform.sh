#!/bin/bash

cd Carte/ && node server.js &
cd Canneberge_api && node app.js &
if [[ "$1" -eq 0 ]]; then

	cd Admin-Client/ && ng serve --port 8000 &
else
	cd Admin-Client/ && ng serve --port 8000 --host "$1" &
fi
	
echo "Platform running!"
if [[ "$1" -eq 0 ]]; then
	echo "http://localhost:8000"
else
	echo "http://$1:8000"
fi
