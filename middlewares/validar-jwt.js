const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const User = require('../models/user');
const user = require('../models/user');

const validarJWT = async ( req = request, res = response, next ) => {
    try {
        const token = req.header('x-token');
    
        if( !token ) {
            return res.status(401).json({
                msg: 'There is no token in the request'
            });
        }

        const { uid }  = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const user = await User.findById( uid );
        
        if( !user ) {
            return res.status(401).json({
                msg: 'User does not exist'
            });    
        }

        if( !user.status ) {
            return res.status(401).json({
                msg: 'User with status false'
            });    
        }

        req.user = user;

        next();
    } catch ( error ) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token invalid'
        });
    }
}

module.exports = {
    validarJWT
}