const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
    email:{type: String,required: true,unique: true},
    password:{type: String,required: true},
    usunom:{type: String,required: true},   
    tipo:{type: String,required: true},
    departamento:{type: String},
    fecha:{type: Date},
    telefono:{type: Number},
    celular:{type: Number},
    sexo:{type: String},
    civil:{type: String}
})

UsuarioSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}

UsuarioSchema.methods.matchPassword =  async function (password){
    return await bcrypt.compare(password,this.password);
}

module.exports = model("Usuario", UsuarioSchema);

