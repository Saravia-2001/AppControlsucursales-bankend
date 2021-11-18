'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var usuarioSchema = Schema ({
    nombre: String,
    usuario: String,
    password: String,
    email: String,
    role: String,
    image: String,
});

module.exports = mongoose.model('usuarios', usuarioSchema)