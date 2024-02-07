build:
	cd frontend && yarn build

update:
	echo ######################
	echo # update is DISABLED #
	echo ######################
	# python data.py >out.md
	# node handle_data.js
	# cp database.json database/0.json
	# cat database.json
	echo "1" >number.json

backup:
	node backup.js

dev-frontend:
	cd frontend && yarn dev

dev-backend:
	yarn dev

initalize:
	./initalize.bat

start:
	./start.bat
