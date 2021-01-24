const cloudinary = require('cloudinary')
const fs = require('fs');


const {
    CLOUDINARY_PASSWORD
} = process.env;

cloudinary.config({
    cloud_name: 'minhobook',
    api_key: '238725248441499',
    api_secret: `${CLOUDINARY_PASSWORD}`
});

function uploadFile(){

}

module.exports.resizeImage = resizeImageToSize;