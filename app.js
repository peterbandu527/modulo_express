const express = require('express');
const morgan = require('morgan');
const app = express();
const usuarios = require('./modulos/usuarios/rutas');
const error = require('./red/errors'); 

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use('/api/usuarios', usuarios)
app.use('/',require('./router')); 



app.use(error);
app.listen(5000, ()=>{
    console.log('SERVER corriendo en http://localhost:5000');
});