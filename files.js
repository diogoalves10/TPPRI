const cloudinary = require('cloudinary').v2
const fs = require('fs');
const unzipper = require('unzipper')
const sha256File = require('sha256-file');
const glob = require('glob');
const del = require('del');
const dir = 'temp';
const path = require('path')


const {
    CLOUDINARY_PASSWORD
} = process.env;

cloudinary.config({
    cloud_name: 'minhobook',
    api_key: '238725248441499',
    api_secret: `${CLOUDINARY_PASSWORD}`
});

function uploadPicture(acutalPath, name){
    return new Promise((successCallback, failureCallback) => {
        cloudinary.uploader.upload(
            acutalPath,
            { folder :  'users', public_id : name, width:700, crop: "scale"},
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

function uploadAsset(acutalPath, name){
    return new Promise((successCallback, failureCallback) => {
        cloudinary.uploader.upload(
            acutalPath,
            { folder :  'zips', public_id : name,resource_type: "raw" },
            function(err, image) {
                if (err)
                    failureCallback(err);
                const fs = require('fs')
                fs.unlinkSync(acutalPath)
                successCallback(image)
            }
        )
    })
}

function gerarZip(path){
    return new Promise((successCallback, failureCallback) => {
        let files = [], filesNotOk = [], filesInsideFolder = [], filesInManifestButNot = []
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
                        if(aaa.length>0)
                            failureCallback({files,filesNotOk, filesStructure :aaa})
                    })

                    // FILES STRUCTURE OK


                    let pathDirData = pathDir+'data/';


                    getFiles(pathDirData, filesInsideFolder)

                    fs.readFile(pathDir+'/manifest-sha256.txt', 'utf8' , (err, data) => {
                        if (err|| !data){
                            failureCallback()
                        }

                        var char = '\n';
                        var i = j = 0;
                        (async () => {
                            try {
                                while ((j = data.indexOf(char, i)) !== -1) {
                                    let line = data.substring(i, j)
                                    i = j + 1;
                                    await lineSha(line,files, filesNotOk, filesInManifestButNot, pathDir+'data/')
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
                            if(filesNotOk.length !== 0){
                                failureCallback({files, filesNotOk, filesInsideFolder, filesInManifestButNot})
                            } else if(filesInManifestButNot.length !=0)
                                failureCallback({files, filesNotOk, filesInsideFolder, filesInManifestButNot})
                            else
                                successCallback({files, filesNotOk, filesInsideFolder, filesInManifestButNot})
                        }).catch(e => {
                            failureCallback({files, filesNotOk, filesInsideFolder, filesInManifestButNot})
                        })
                    })
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

async function lineSha(line, files, filesNotOk,filesInManifestButNot, pathDirectory){
    return new Promise(function(resolve, reject) {
        let split = line.replace(' ', '&').split('&')
        let sha = split[0]
        let filePath = pathDirectory + split[1];

        fs.access(filePath, error => {
            if (!error) {
                sha256File(filePath, function (error, sum) {
                    if (sum != sha) filesNotOk.push(split[1]);
                    else
                        files.push(split[1])
                    resolve()
                })
            } else {
                filesInManifestButNot.push(filePath.split("/data/").pop())
                resolve()
            }
        });

    })
}

function getFiles(dir, files) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            getFiles(fullPath, files);
        } else {
            files.push(fullPath.split("/data/").pop())
        }
    });
}

module.exports.gerarZip = gerarZip;
module.exports.uploadPicture = uploadPicture;
module.exports.uploadAsset =  uploadAsset;
module.exports.deleteFile =  deleteFile;