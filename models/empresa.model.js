'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var empresaSchema = Schema ({
    nombreEmpresa: String,
    password: String,
    role: String,
});

module.exports = mongoose.model('empresa', empresaSchema)