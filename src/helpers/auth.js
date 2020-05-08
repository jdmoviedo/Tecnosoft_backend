const helpers={};
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {KEY} =  process.env;

helpers.verifytoken = (req,res,next) =>{
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
}

module.exports = helpers;