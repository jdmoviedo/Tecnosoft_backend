require('dotenv').config();

const mongoose = require('mongoose');

const {TECNOSOFT_HOST,TECNOSOFT_DATABASE} =  process.env;
const MONGODB_URI = `mongodb://${TECNOSOFT_HOST}/${TECNOSOFT_DATABASE}`;

mongoose.connect(MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
})

.then(db => console.log('Base de Datos Conectada'))
.catch(err => console.log(err));