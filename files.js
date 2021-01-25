const cloudinary = require('cloudinary').v2

const {
    CLOUDINARY_PASSWORD
} = process.env;

cloudinary.config({
    cloud_name: 'minhobook',
    api_key: '238725248441499',
    api_secret: `${CLOUDINARY_PASSWORD}`
});

function uploadPicture(acutalPath, folder, name){
    return new Promise((successCallback, failureCallback) => {
        cloudinary.uploader.upload(
            acutalPath,
            { folder :  folder, public_id : name, width:700, crop: "scale"},
            function(err, image) {
                if (err)
                    failureCallback("Échec");
                const fs = require('fs')
                fs.unlinkSync(acutalPath)
                successCallback(image)
            }
        )
    })
}

function gerarZip(path){
    return new Promise((successCallback, failureCallback) => {

    })
}

module.exports.gerarZip = gerarZip;
module.exports.uploadPicture = uploadPicture;
