const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');
const coleccionesPermitidas = [
    'users', 'products', 'roles', 'categories' 
];

const searchUsers = async( termino, res ) => {
    const isMongoId = ObjectId.isValid( termino );
    if( isMongoId ){
        const user = await User.findById( termino );
        return res.json({
            results: ( user ) ? [ user ]: []
        });
    }
    const regex = new RegExp(termino, 'i');
    const users = await User.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{status: true}]
    });
    res.json({
        results: ( users ) ? users : []
    });
}

const searchCategories = async( termino, res ) => {
    const isMongoId = ObjectId.isValid( termino );
    if( isMongoId ){
        const category = await Category.findById( termino );
        return res.json({
            results: ( category ) ? [ category ]: []
        });
    }
    const regex = new RegExp(termino, 'i');
    const categories = await Category.find({
        $and: [{status: true}, {name: regex}]
    });
    res.json({
        results: ( categories ) ? categories : []
    });
}

const searchProducts = async( termino, res ) => {
    const isMongoId = ObjectId.isValid( termino );
    if( isMongoId ){
        const product = await Product.findById( termino );
        return res.json({
            results: ( product ) ? [ product ]: []
        });
    }
    const regex = new RegExp(termino, 'i');
    const products = await Product.find({
        $and: [{status: true}, {name: regex}]
    });
    res.json({
        results: ( products ) ? products : []
    });
}

const buscar = ( req, res ) => {
    try{
        const { coleccion, termino } = req.params;
        if(!coleccionesPermitidas.includes( coleccion )){
            return res.status(400).json({
                msg: `allowed collections are ${ coleccionesPermitidas }`
            });
        }

        switch(coleccion){
            case 'users':
                searchUsers( termino, res );
                break; 
            case 'products':
                searchProducts( termino, res );
                break; 
            case 'categories':
                searchCategories( termino, res );
                break;
            default:
                res.status(500).json({
                    msg: 'this search does not exist'
                })
        }

    } catch (err) {
        res.status(500).json( { msg:'Ocurrio un error' } );
    }
}

module.exports = {
    buscar
}