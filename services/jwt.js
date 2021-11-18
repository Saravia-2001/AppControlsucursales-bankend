'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secretKey = 'Clave_Secreta_McDonalds'

exports.createToken = (user) => {
    var payload = {
        sub: user._id,
        nombre: user.name,
        usuario: user.username,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(10, 'days').unix()
    }
    return jwt.encode(payload, secretKey)
}