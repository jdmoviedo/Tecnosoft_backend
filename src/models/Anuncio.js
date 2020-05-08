const {Schema, model} = require('mongoose');

const AnuncioSchema = new Schema({
    codigo:{type: String,required: true,unique: true},
    titulo:{type: String,required: true},
    descripcion:{type: String,required: true} 
},{timestamps: true})

module.exports = model('Anuncio',AnuncioSchema);
