const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const userGet = async (req = request, res = response) => {
    const { query: { limit = 5, since = 0 } } = req;
    
    // const users = await User.find({ status: true })
    //     .skip( since )
    //     .limit( limit );
    // const count = await User.countDocuments({ status: true });

    const [ count, users ] = await Promise.all([
        User.countDocuments({ status: true }),
        User.find({ status: true })
        .skip( since )
        .limit( limit )
    ]);

    res.status(200).json({
        body: {count, users}
        // body: { resp }
    });
}

const userPost = async (req = request, res = response) => {
    try {
        const { body: { name, email, password, role } } = req;
        const user = new User({ name, email, password, role});
        
        // Encriptar la constraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );

        // Guardar en DB
        await user.save();

        res.status(200).json({
            msg: 'post API - controller',
            user
        });
    } catch ( err ) {
        console.log( err );
        res.status(500).json( { msg:'Ocurrio un error', err} );
    }
}

const userPut = async (req = request, res = response) => {
    const { params: { id } } = req;
    const { body: { _id, google, password, email, ...resto } } = req;

    if( password ) {
        // Encriptar la constraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt ); 
    }

    const user = await User.findByIdAndUpdate( id, resto );

    res.status(200).json({
        msg: 'put API - controller',
        user
    });
}

const userDelete = async (req = request, res = response) => {
    const { params: { id }, user : userAuthenticated } = req;

    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete( id );
    try {
        const user = await User.findByIdAndUpdate( id, {status : false});
        res.status(200).json({
            msg: 'delete API - controller',
            body: {
                user,
                userAuthenticated
            }
        });
    } catch ( error ) {
        console.log(error);
    }
}

const userPatch = (req = request, res = response) => {
    res.status(403).json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}