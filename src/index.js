require('dotenv').config();
const express = require('express');
const app = express();


const cors = require('cors');

require ('./database');

;
app.use(express.json()) ;
app.use(cors())

app.use('/api', require('./routes/index.routes'));


app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () =>{
    console.log('Server on port',app.get('port'));
})