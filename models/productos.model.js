'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productosSchema = Schema ({
    name: String,
    nombreProveedor: String,
    quantity : Number,
    sales: Number
});

module.exports = mongoose.model('productos', productosSchema)