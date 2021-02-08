copy the .env.example to an .env file and change the values.

        // run mongo : sudo mongod --dbpath data --port 5050

to calculate hash :
    cd data/
    find * -type f -exec sha256sum {} \; > ../manifest-sha256.txt

zip : 
    cd file
    zip -r file.zip .

unzip :
    mv *filename* file.zip
    unzip file.zip 