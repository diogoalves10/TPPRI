const Asset = require('../models/asset')
const ObjectId = require('mongodb').ObjectId;
const AssetTypes = require('../controllers/assetsTypes')
const Files = require('../files')

module.exports.insert = (files, zip, user, type, privat, title, tags, descricao, date) => {
    return new Promise((resolve, reject) => {
        let u = new Asset();
        u.prop = user.id;
        u.title = title;
        u.descricao = descricao;
        u.creation_time = new Date(date)
        u.private = privat ==='on';
        u.files =files;
        if(tags.length > 0)
            u.tags = tags.replace(/\s/g, '').split(',')
        else
            u.tags = []
        AssetTypes.lookByName(type).then(typeDB => {
            if(!typeDB)
                u.type  = AssetTypes.insert(type).id;
            else
                u.type  = typeDB.id

            zip = zip.split('/')[1]
            Files.uploadAsset(__dirname+'/../uploads/'+zip, zip).then(p => {
                u.link = p.url
                u.save().then(a=>{
                    resolve(u);
                });
            }).catch(e => {
                console.log(e)
            })
        })
    });
}

module.exports.list = () => Asset.find({_id: id})
module.exports.lookUp = id =>  Asset.findById(id)
module.exports.lookUpByUser = id_uer =>  Asset.find({prop: id_uer})
module.exports.lookUpByTag = tag => Asset.find({ tags: { "$in" : tag} })
module.exports.edit = a => Asset.findByIdAndUpdate(a._id, a, {new: true}).exec()

/*
module.exports.lookUpByInfos = info => User.findOne({$or:[{username: info},{email: info}]})
module.exports.edit = p => User.findByIdAndUpdate(p._id, p, {new: true}).exec()
module.exports.delete = id => User.deleteOne({_id: id}).exec()

*/

