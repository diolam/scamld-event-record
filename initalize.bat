mkdir database
copy database.json.backup database
move database\database.json.backup database\0.json
echo 1 >number.json
yarn

cd frontend
yarn
cd ..

make

.\start
