const mongoose = require('mongoose');
const {
    MONGO_HOST,
    MONGO_PORT
} = process.env;

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/uminhobook`,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false , useCreateIndex: true});
const db = mongoose.connection;
db.once('open', () => console.log("Conexão ao MongoDB realizada com sucesso..."));
db.on('error', () => console.log("Conexão ao MongoDB deu erro..."));

module.exports.mongoose = mongoose;