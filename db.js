const mongoose = require('mongoose');
const {
    MONGO_USERNAME,
    MONGO_PASSWORD
} = process.env;
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.w1fgs.mongodb.net/uminhobook?retryWrites=true&w=majority`;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false , useCreateIndex: true});
const db = mongoose.connection;
db.once('open', () => console.log("Conexão ao MongoDB realizada com sucesso..."));
db.on('error', () => console.log("Conexão ao MongoDB deu erro..."));

module.exports.mongoose = mongoose;
module.exports.uri = uri;