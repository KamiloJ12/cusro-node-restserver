const { request, response } = require('express');
const { Category } = require('../models');

const getCategories = async ( req = request, res = response ) => {
    const { query: { limit = 5, since = 0 } } = req;

    const [ count, categories ] = await Promise.all([
        Category.countDocuments({ status: true }),
        Category.find({ status: true })
            .populate('user', 'name')
            .skip( since )
            .limit( limit )
    ]);

    res.status(200).json({
        body: {count, categories}
        // body: { resp }
    }); 
}

const getCategory = async ( req = request, res = response ) => {
    try {
        const { params: { id } } = req;
    
        const category = await Category.findOne( {$and: [{ status: true }, { _id: id }]}).populate('user', 'name');
        
        res.status(200).json({
            body: { category }
        });
    } catch (err) {
        res.status(500).json( { msg:'Ocurrio un error', err} );
    }
}

const createCategory = async ( req = request, res = response ) => {
    try {
        const name = req.body.name.toUpperCase();
        const categoryDB = await Category.findOne({name});
        
        if( categoryDB ){
            return res.status(400).json({
                msg: `The category ${name} already exists`
            });
        }

        const data = { name, user: req.user._id };
        const category = new Category( data );
        await category.save();

        res.status(201).json( category );
    } catch ( error ) {
        res.status(500).json( { msg:'Ocurrio un error', err} );
    }
}

const updateCategory = async ( req = request, res = response ) => {
    try{
        const { params: { id } } = req;
        const { status, user, ...data } = req.data;

        data.nombre = data.nombre.toUpperCase();
        data.user   = data.user._id;
        const category = await Category.findByIdAndUpdate( id, data, { new: true } );

        res.status(200).json({
            category
        });
    } catch ( error ) {
        res.status(500).json( { msg:'Ocurrio un error', err} );
    }
}

const deleteCategory = async ( req = request, res = response ) => {
    try{
        const category = await Category.findByIdAndUpdate( id, {status : false});
        res.status(200).json({
            category
        });
    } catch ( error ) {
        res.status(500).json( { msg:'Ocurrio un error', err} );
    }
}

module.exports = {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory
}