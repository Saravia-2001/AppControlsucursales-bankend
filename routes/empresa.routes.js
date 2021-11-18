'use strict'

// IMPORTACIONES
var express = require('express');
var empresaController = require('../controllers/empresa.controller');

// IMPORTACION MIDDLEWARES PARA RUTAS
var mdAuth = require('../middlewares/authenticated');

// RUTAS
var api = express.Router();

// Login Usuario y Empresa
api.post('/Login', empresaController.Login);
api.post('/LoginEmpresa', empresaController.LoginEmpresa);


// --- Sucursales ---
api.get('/getSucursal/:idS', mdAuth.ensureAuth, empresaController.getSucursal);
api.post('/saveSucursal/:idE', mdAuth.ensureAuth,empresaController.saveSucursal);
api.delete('/removeSucursal/:idE/:idS', mdAuth.ensureAuth, empresaController.removeSucursal);
api.put('/updateSucursal/:idE/:idS', mdAuth.ensureAuth, empresaController.updateSucursal);
api.get('/getSucursales', mdAuth.ensureAuth,empresaController.getSucursales);
api.post('/search', mdAuth.ensureAuth, empresaController.search);


// --- Productos ---
api.get('/listProduct', mdAuth.ensureAuth, empresaController.listProduct);
api.post('/saveProducto', mdAuth.ensureAuth,empresaController.saveProducto);
api.delete('/removeProducto/:idE/:idP', mdAuth.ensureAuth, empresaController.removeProducto);
api.put('/updateProduct/:idE/:id', mdAuth.ensureAuth, empresaController.updateProduct);
api.put('/searchProduct', mdAuth.ensureAuth,empresaController.searchProduct);
api.put('/addStock/:id', mdAuth.ensureAuth,empresaController.addStock);
api.get('/productAgot', mdAuth.ensureAuth,empresaController.productAgot);
api.get('/productosMasVendidos', mdAuth.ensureAuth,empresaController.productmaxSales);


// EXPORTAR
module.exports = api;