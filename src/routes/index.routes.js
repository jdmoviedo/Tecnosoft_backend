const { Router } = require ('express');
const router = Router();
const Usuario = require ('../models/Usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {KEY} =  process.env;
router.get('/', (req,res) => res.send('HOLA MUNDO'));

const errors = [];

const{verifytoken} = require('../helpers/auth')

router.post('/signup', async(req,res) => {
    const {usunom,email,password,tipo,confirm_password} = req.body;
    if(password != confirm_password){
        errors.push({text:'pass'})
        return res.status(401).send("Contraseñas no coinciden");
     }
    if(password.length < 6){
        errors.push({text:'poco'});
        return res.status(401).send("Contraseñas deben ser mayor a 6 caracteres");
     }
    if(errors.length > 0){
        
    }else{
        const emailuser = await Usuario.findOne({email:email});
        if(emailuser){
            return res.status(401).send("El correo ya existe");

        }else{
            const newUsuario = new Usuario({usunom,email,password,tipo});
            newUsuario.password = await newUsuario.encryptPassword(password);
            await newUsuario.save();
            const token = jwt.sign({_id: newUsuario._id},`${KEY}`);
            return res.status(200).json({token});       
        }
    }
    
})

router.post('/signin', async(req,res) => {
    const{email,password} = req.body;
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        return res.status(401).send("El correo no existe");
    }else{
        const match = await usuario.matchPassword(password);
        if(match){
            const token = jwt.sign({_id: usuario._id},`${KEY}`);
            return res.status(200).json({token});
        }else{
            return res.status(401).send("Contraseña Incorrecta");
        }
    }
})

router.get('/menu', verifytoken, (req,res) =>{
    res.json([{
        _id:1,
        name: 'juan'
    }])
})

router.get('/principal', (req,res) =>{
    res.json([{
        _id:2,
        name: 'david'
    }])
})
/*function verifytoken (req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('No estas autorizado');
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token==='null'){
        return res.status(401).send('No estas autorizado');
    }

    const payload = jwt.verify(token, `${KEY}`)
     req.userId = payload._id;
     next();
}*/
module.exports = router; 
