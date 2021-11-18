'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;
var userInit = require('./controllers/empresa.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DBAppControlSucursales', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        userInit.initAdmin();
        userInit.initEmpresa();
        console.log('Se encuentra conectado a la base de datos');
        app.listen(port, ()=>{
            console.log("Servidor corriendo en el puerto " + port)
        })
    })
    .catch((err)=>console.log('Error de conexión a la base de datos', err))
    