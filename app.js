const express = require('express');
const db = require('./database/db'); // Importa la conexión a la base de datos
const morgan = require('morgan');
const app = express();
const clientes = require('./modulos/clientes/rutas');
const error = require('./red/errors');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/api/clientes', clientes)
app.use('/',require('./router')); 

app.use(error);
app.listen(5000, ()=>{
    console.log('SERVER corriendo en http://localhost:5000');
});