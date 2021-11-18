'user strict'

var Usuario = require('../models/usuario.model');
var Empresa = require('../models/empresa.model');
var Sucursal = require('../models/sucursales.model');
var Producto = require('../models/productos.model');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');
const { param } = require('../routes/empresa.routes');



////////////////////////// Administrador de inicio /////////////////////////////
function initAdmin(req, res){
    let user = new Usuario();
    user.usuario = 'AdminMc'
    user.password = '123456'

    Usuario.findOne({usuario: user.usuario}, (err, adminFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(adminFind){
            return console.log('Usuario Admin ya existente')
        }else{
            bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error al intentar comparar las contraseñas'})
                }else if(passwordHash){
                    user.password = passwordHash;
                    user.usuario = user.usuario;
                    user.role = 'ROLE_ADMIN';
                    user.save((err, userSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al guardar Administrador'})
                        }else if(userSaved){
                            return console.log('Administrador creado satisfactoriamente')
                        }else{
                            return res.status(500).send({message: 'Administrador no guardado'})
                        }
                    })
                }else{
                    return res.status(403).send({message: 'La encriptación de la contraseña falló'})
                }
            })
        }
    })
}



////////////////////////// Empresa McDonald's /////////////////////////////
function initEmpresa(req, res){
    let empresa = new Empresa();
    empresa.nombreEmpresa = 'McDonalds'
    empresa.password = '12345678'

    Empresa.findOne({nombreEmpresa: empresa.nombreEmpresa}, (err, EmpresaFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(EmpresaFind){
            return console.log('Empresa ya existente')
        }else{
            bcrypt.hash(empresa.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error al intentar comparar las contraseñas'})
                }else if(passwordHash){
                    empresa.password = passwordHash;
                    empresa.nombreEmpresa = empresa.nombreEmpresa;
                    empresa.role = 'ROLE_EMPRESA';
                    empresa.save((err, empresaSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al guardar la Empresa'})
                        }else if(empresaSaved){
                            return console.log('Empresa Lista!')
                        }else{
                            return res.status(500).send({message: 'Empresa no guardado'})
                        }
                    })
                }else{
                    return res.status(403).send({message: 'La encriptación de la contraseña falló'})
                }
            })
        }
    })
}



////////////////////////// Login Usuario /////////////////////////////
        function Login(req, res){
            var params = req.body;
        
            if(params.usuario && params.password){
                Usuario.findOne({usuario: params.usuario}, (err, userFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'});
                    }else if(userFind){
                        bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al comparar contraseñas'});
                            }else if(checkPassword){
                                if(params.gettoken = 'true'){
                                    res.send({
                                        token: jwt.createToken(userFind),
                                         user: userFind
                                    })
                                }else{
                                    return res.send({message: 'Usuario logeado'});
                                }
                            }else{
                                return res.status(403).send({message: 'Usuario o contraseña incorrectos'});
                            }
                        })
                    }else{
                        return res.status(401).send({message: 'Cuenta de usuario no encontrada'});
                    }
                })
            }else{
                return res.status(404).send({message: 'Por favor envía los campos obligatorios'});
            }
        }
        


////////////////////////// Login Empresa /////////////////////////////
function LoginEmpresa(req, res){
    var params = req.body;

    if(params.nombreEmpresa && params.password){
        Empresa.findOne({nombreEmpresa: params.nombreEmpresa}, (err, EmpresaFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(EmpresaFind){
                bcrypt.compare(params.password, EmpresaFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseñas'});
                    }else if(checkPassword){
                        if(params.gettoken = 'true'){
                            res.send({
                                token: jwt.createToken(EmpresaFind),
                            })
                        }else{
                            return res.send({message: 'Empresa logeada'});
                        }
                    }else{
                        return res.status(403).send({message: 'Nombre o contraseña incorrectos'});
                    }
                })
            }else{
                return res.status(401).send({message: 'Nombre no encontrado'});
            }
        })
    }else{
        return res.status(404).send({message: 'Por favor envía los campos obligatorios'});
    }
}
        


// ------------------------------------------------------------------------------------



////////////////////////// Obtener por Sucursal  /////////////////////////////
function getSucursal(req, res){
    let sucursalId = req.params.idS; 

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
    Sucursal.findOne({_id:sucursalId}, (err, sucursalFind)=>{
        if(err){
            return res.status(500).send({message: "Ha ocurrido un error al realizar la busqueda del sucursal"})
        }else if(sucursalFind){console.log(sucursalFind)
            return res.send({message: "La Sucursal han sido encontrados exitosamente", sucursalFind})
            
        }else{
            return res.status(204).send({message: "No se ha encontrado ningún sucursal"})
        }
    })
}
 }



////////////////////////// Crear Sucursal /////////////////////////////
function saveSucursal(req, res){
    var sucursal = new Sucursal();
    var empresaId = req.params.idE;
    var params = req.body;

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
    if(params.nombreSucursal && params.direccionSucursal){
        Sucursal.findOne({nombreSucursal: params.nombreSucursal}, (err, SucursalFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al guardar la Sucursal'});
            }else if(SucursalFind){
                res.send({message: 'Esta Sucursal ya existe'});
            }else{
                sucursal.nombreSucursal = params.nombreSucursal;
                sucursal.direccionSucursal = params.direccionSucursal;
                sucursal.idEmpresa = empresaId;


                sucursal.save((err, sucursalSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar la Sucursal'})
                    }else if(sucursalSaved){
                        return res.send({message: 'La Sucursal ha sido creada exitosamentee', sucursalSaved})
                    }else {
                        return res.status(403).send({message: 'La Sucursal no ha sido creada'}) 
                    }
                })

            }
        })
    }else {
        return res.status(404).send({message: 'Por favor llenar todos los campos requeridos'});
    }
}


}



 ////////////////////////// Buscar Sucursal /////////////////////////////
function search(req, res){
    var params = req.body;

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{

        Sucursal.find({$or:[{nombreSucursal: {$regex: '^' + params.nombreSucursal, $options: 'i'}}]}, (err,sucursalFind)=>{
            if(err){
                res.status(500).send({message: "Error general del servidor: "+err})
            }else if(sucursalFind){
                res.send({message: 'Sucursal Encontrados',sucursalFind });

            }else{
                res.status(404).send({message: "No hay Sucursales"});
            }
        })
    }
     }



////////////////////////// Eliminar Sucursal /////////////////////////////
function removeSucursal(req, res){
    let empresaId = req.params.idE;
    let sucursalId = req.params.idS;


    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
    Empresa.findOneAndUpdate({_id: empresaId, sucursal: sucursalId},
            {$pull: {sucursal: sucursalId}}, {new:true}, (err, sucursalPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(sucursalPull){
                    Sucursal.findByIdAndRemove(sucursalId, (err, sucursalRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general durante la eliminación', err})
                        }else if(sucursalRemoved){
                            return res.send({message: 'Sucursal eliminada de manera exitosa', sucursalPull});
                        }else{
                            return res.status(404).send({message: 'Sucursal no encontrada o ya eliminada'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No se puede eliminar por falta de datos'})
                }
            })
   
}
 }



////////////////////////// Actualizar Sucursal /////////////////////////////
function updateSucursal(req, res){
    let empresaId = req.params.idE;
    let sucursalId = req.params.idS;
    let update = req.body;


    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
        if(update.nombreSucursal){
            Empresa.findOne({_id: empresaId, sucursales: sucursalId}, (err, EmpresaSucursal)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al actualizar'});
                }else if(EmpresaSucursal){
                    
                    Sucursal.findByIdAndUpdate(sucursalId, update, {new: true}, (err, updateSucursal)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al actualizar la Sucursal'});
                        }else if(updateSucursal){
                            Empresa.findOne({_id: empresaId, sucursales: sucursalId}, (err, SucursalAct)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar la Sucursal 2'});
                                }else if(SucursalAct){
                                    return res.send({message: 'Sucursal actualizada exitosamente', SucursalAct});
                                }
                            })
                            
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar la Sucursal'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'La Sucursal no existe o ya ha sido actualizada'});
                }
            })
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos mínimos para poder actualizar la Sucursal'});
        }       
   
}
 }



////////////////////////// Obtener Todas las  Sucursales de la Empresa /////////////////////////////
function getSucursales(req, res){

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{

    Sucursal.find({}).exec((err, sucursales) => {
        if(err){
            return res.status(500).send({message: "Error al buscar las Sucursales"})
        }else if(sucursales){
            console.log(sucursales)
            return res.send({message: "Las Sucursales han sido encontradas", sucursales})
        }else{
            return res.status(204).send({message: "No se encontraron las Sucursales"})
        }
    })
  }
 }



// ----------------------------------------------------------------------------------------



 ////////////////////////// Crear Producto /////////////////////////////
function saveProducto(req, res){
    var producto = new Producto();
    var empresaId = req.params.idE;
    var params = req.body;

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
    if(params.name && params.nombreProveedor && params.quantity){
        Producto.findOne({name: params.name}, (err, ProductoFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al guardar el Producto'});
            }else if(ProductoFind){
                res.send({message: 'Este Producto ya existe'});
            }else{
                producto.name = params.name;
                producto.nombreProveedor = params.nombreProveedor;
                producto.quantity = params.quantity;
                producto.sales = 0;


                producto.save((err, productoSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar el producto'})
                    }else if(productoSaved){
                        return res.send({message: 'El Producto ha sido creada exitosamentee', productoSaved})
                    }else {
                        return res.status(403).send({message: 'el Producto no ha sido creada'}) 
                    }
                })

            }
        })
    }else {
        return res.status(404).send({message: 'Por favor llenar todos los campos requeridos'});
    }
}


}



 ////////////////////////// Editar Producto /////////////////////////////
function updateProduct(req,res){
    var idProduct = req.params.id;
    var idEmpresa = req.params.idE;

    var body = req.body;

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
        Producto.findOne({name:body.name}, (err, productrepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(productrepeat){
                res.status(404).send({message:"Este producto ya existe en la base de datos"});
            }else{
                Producto.findByIdAndUpdate(idProduct,body,{new:true},(err,productupdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(productupdate){
                        res.send({message:productupdate});
                    }else{
                        res.status(404).send({message:"No se encontro el producto al que decea actualizar"});
                    }
                });
            }
        });   
    
}
 }


////////////////////////// Eliminar Producto /////////////////////////////
function removeProducto(req, res){
    let empresaId = req.params.idE;
    let productoId = req.params.idP;


    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
    Empresa.findOneAndUpdate({_id: empresaId, producto: productoId},
            {$pull: {producto: productoId}}, {new:true}, (err, productoPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(productoPull){
                    Producto.findByIdAndRemove(productoId, (err, productoRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general durante la eliminación', err})
                        }else if(productoRemoved){
                            return res.send({message: 'Producto eliminada de manera exitosa', productoPull});
                        }else{
                            return res.status(404).send({message: 'Producto no encontrada o ya eliminada'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No se puede eliminar por falta de datos'})
                }
            })
   
}
 }



////////////////////////// Listar Producto /////////////////////////////
function listProduct(req,res){

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
        Producto.find({},(err,listproduct)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(listproduct){
                res.send({message:listproduct});
            }else{
                res.status(400).send({message:"No hay productos "});
            }
        });
    }
    
}



 ////////////////////////// Añadir Stock /////////////////////////////
function addStock(req,res){
    var idProduct = req.params.id;
    var body = req.body;
    

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
        Producto.findById(idProduct,{quantity:1},(err,productfind)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(productfind){
                console.log(productfind)
                var suma = Number(productfind.quantity) + Number(body.quantity);
                let update = {quantity:suma};
    
                Producto.findByIdAndUpdate(idProduct,update,{new:true},(err,addproduct)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(addproduct){
                        res.send({producto_Actualizado: addproduct});
                    }else{
                        res.status(404).send({message:"No se logro agregar la cantidad al producto que decea actualizar"});
                    }
                })
            }else{
                res.status(404).send({message:"No se encontro el producto al que desea modificar"});
            }
        });   
    }
}



 ////////////////////////// Buscar Producto /////////////////////////////
function searchProduct(req,res){
    var params = req.body;
    
    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{

        Producto.find({$or:[{name: {$regex: '^' + params.name, $options: 'i'}}]}, (err,ProductoFind)=>{
            if(err){
                res.status(500).send({message: "Error general del servidor: "+err})
            }else if(ProductoFind){
                res.send({message: 'Productos Encontrados',ProductoFind });

            }else{
                res.status(404).send({message: "No hay Productos"});
            }
        })
    }
     }



 ////////////////////////// Producto Agotado ////////////////////////////
function productAgot(req, res){
    var idUser = req.params.id;

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
        Producto.find({quantity:0},(err,productend)=>{
            if(err){
                res.status(500).send({message:"Error general en el sistema ", err});
            }else if(productend){
                res.send({productend})
            }else{
                res.status(404).send({message:"No existen productos agotados"});
            }
        });
    }
}



 ////////////////////////// Producto mas Vendidos /////////////////////////////
function productmaxSales(req, res){
    var iduser = req.params.id;

    if(req.user.role != "ROLE_EMPRESA"){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción, solo la empresa puede agregar la Sucursal'});
    }else{
        Producto.find({},null,{sort:{sales:-1}},(err,productend)=>{
            if(err){
                res.status(500).send({message:"Error general en el sistema ", err});
            }else if(productend){
                res.send({productend});
            }else{
                res.status(404).send({message:"No existen productos agotados"});
            }
        });
    }
}



module.exports = {
    initAdmin,
    initEmpresa,

    Login,
    LoginEmpresa,

    getSucursal,
    saveSucursal,
    removeSucursal,
    updateSucursal,
    getSucursales,
    search,

    saveProducto,
    updateProduct,
    removeProducto,
    listProduct,
    addStock,
    searchProduct,
    productAgot,
    productmaxSales
    }