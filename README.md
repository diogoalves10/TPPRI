1 - Run on docker :
copy the content of .env.example to an .env and start the docker compose  
docker run --name mongo-unic -p5050:27017 -v ~/UMinho/PRI/TPPRI/data:/data/db -d mongo
2 - Run without docker : copy the .env.example to an .env file and change the values
        run mongo : sudo mongod --dbpath data --port 5050this


