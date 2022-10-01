const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generarJWT.js');
const User = require('../models/user');
const { googleVerify } = require('../helpers/google-verify.js');

const login = async ( req = request, res = response ) => {
    try{
        const { body: { email, password }} = req;
        const user = await User.findOne({ email });
 
        if( !user ) {
            return res.status(400).json({ msg: 'email is invalid'});
        }

        if( !user.status ) {
            return res.status(400).json({ msg: 'user is not active'});
        }

        if( !bcryptjs.compareSync( password, user.password ) ){
            return res.status(400).json({ msg: 'password is invalid'});
        }

        const token = await generarJWT( user.id );

        res.status(200).json({
            body: {
                user,
                token
            }
        });

    } catch ( error ) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrio un error en el servidor'
        });
    }
}

const googleSingIn = async ( req = request, res = response) => {
    try {
        const { body: { id_token }} = req;
        const { name, email, picture: image } = await googleVerify( id_token );
        
        let user = await User.findOne({ email });

        if( !user ){
            const data = { name, email, password:'password', image, google: true };
            user = new User( data );
            await user.save();
        }

        if( !user.status ) {
            return res.status(401).json({
                msg: 'User with status false'
            });    
        }

        const token = await generarJWT( user.id );

        res.status(200).json({
            user,
            token
        });

    } catch ( err ) {
        console.log(err);
        res.status(400).json({
            ok: false,
            msg: 'Token is invalid'
        })
    } 
}

module.exports = {
    login,
    googleSingIn
}