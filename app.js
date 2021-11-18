'use strict'

// VARIABLES GLOBALES
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// IMPORTACION DE RUTAS
var usuarioRoutes = require('./routes/empresa.routes');


// MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// CABECERAS
app.use(cors())

// APLICACION DE RUTAS
app.use('/api', usuarioRoutes);


// EXPORTAR
module.exports = app;