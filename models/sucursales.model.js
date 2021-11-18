'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var sucursalesSchema = Schema ({
    nombreSucursal: String,
    direccionSucursal: String,
    idEmpresa: {type: Schema.ObjectId, ref:"empresa"}
});

module.exports = mongoose.model('sucursales', sucursalesSchema)