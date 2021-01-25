const cloudinary = require('cloudinary').v2
const fs = require('fs');
const unzipper = require('unzipper')
const sha256File = require('sha256-file');
const del = require('del');
const dir = 'temp';


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

function uploadAsset(acutalPath, folder, name){
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
        let files = [], filesNotOk = [], filesInsideFolder = []
        let pathDir = path+'dir'+'/'
        fs.mkdir(pathDir, (err) => {
            if (err)
                failureCallback()
            fs.createReadStream(path)
                .pipe(unzipper.Extract({ path:pathDir })).on('entry', entry => entry.autodrain())
                .promise().then( () => {

                // LIST FILES
                fs.readdir(pathDir, function (err, filesuu) {
                    if (err)
                        failureCallback()
                    var aaa = []
                    filesuu.forEach(function (file) {
                        if(file !== 'bagit.txt' && file !=='data' && file !=='manifest-sha256.txt')
                            aaa.push(file)
                        failureCallback({files,filesNotOk, filesStructure :aaa})
                    })

                    // FILES OK
                    let pathDirData = pathDir+'data/';
                    fs.readdir(pathDirData, function (err, filesuu) {
                        if (err)
                            failureCallback()
                        filesuu.forEach(function (file) {
                            filesInsideFolder.push(file)
                        })
                        filesInsideFolder = [...new Set(filesInsideFolder)];


                        fs.readFile(pathDir+'/manifest-sha256.txt', 'utf8' , (err, data) => {
                            if (err|| !data)
                                failureCallback()
                            var char = '\n';
                            var i = j = 0;
                            (async () => {
                                try {
                                    while ((j = data.indexOf(char, i)) !== -1) {
                                        let line = data.substring(i, j)
                                        i = j + 1;
                                        await lineSha(line,files, filesNotOk, pathDir+'data/')
                                    }
                                    files = [...new Set(files)];
                                    filesNotOk = [...new Set(filesNotOk)];
                                } catch (err) {            }
                            })().then(() => {
                                // delete folder
                                (async () => {
                                    try {
                                        await del(pathDir);
                                    } catch (err) {
                                        console.error(`Error while deleting ${pathDir}.`);
                                    }
                                })();

                                // fail, delete file
                                if(filesNotOk.length !== 0){
                                    console.log(filesNotOk)
                                    failureCallback({files, filesNotOk, filesInsideFolder})
                                }
                                else
                                    successCallback({files, filesNotOk, filesInsideFolder})
                            }).catch(e => {
                                failureCallback({files, filesNotOk, filesInsideFolder})
                            })
                        })
                    });
                });
            }, e => {
                failureCallback()
            })
        });
    })
}

async function deleteFile(path){
    try {
        await del(path);
    } catch (err) {
        console.error(`Error while deleting ${path}.`);
    }
};

async function lineSha(line, files, filesNotOk, pathDirectory){
    return new Promise(function(resolve, reject) {
        let split = line.replace(' ', '&').split('&')
        let sha = split[0]
        let filePath = pathDirectory + split[1];
        sha256File(filePath, function (error, sum) {
            if (error || sum != sha) filesNotOk.push(split[1]);
            else
                files.push(split[1])
            resolve()
        })
    })
}



module.exports.gerarZip = gerarZip;
module.exports.uploadPicture = uploadPicture;
module.exports.uploadAsset =  uploadAsset;
module.exports.deleteFile =  deleteFile;