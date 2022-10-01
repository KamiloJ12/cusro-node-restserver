const { request, response } = require('express');
const { Product } = require('../models');

const getProducts = async ( req = request, res = response ) => {
    try {
        const { query: { limit = 5, since = 0 } } = req;

        const [ count, products ] = await Promise.all([
            Product.countDocuments({status: true}),
            Product.find({ status: true})
                .populate('user', 'name')
                .populate('category', 'name')
                .skip( since )
                .limit( limit )
        ]);

        res.status(200).json({
            body: {count, products}
        }); 

    } catch (err){
        res.status(500).json({ msg: 'Ocurrio un error en el servidor'});
    }
}

const getProduct = async ( req = request, res = response ) => {
    try {
        const { params: { id }} = req;
        const product = await Product.findOne({$and: [{ status: true }, { _id: id }]})
            .populate('user', 'name')
            .populate('category', 'name');

        res.status(200).json({
            product
        });

    } catch (err) {
        res.status(500).json({ msg: 'Ocurrio un error en el servidor'});
    }
}

const createProduct = async ( req = request, res = response ) => {
    try {
        const { status, user, ...body } = req.body;
        
        const name = body.name.toUpperCase();
        const productDB = await Product.findOne({ name });
        
        if( productDB ){
            return res.status(400).json({
                msg: `The product ${name} already exists`
            });
        }

        const data = { ...body, name, user: req.user._id };
        const product = new Product( data );
        await product.save();

        res.status(201).json( product );
    } catch (err) {
        res.status(500).json({ msg: 'Ocurrio un error en el servidor'});
    }
}

const updateProduct = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { status, user, ...data } = req.body;
        
        if ( data.name ) {
            data.name = data.name.toUpperCase();
        }
        data.user = req.user._id;
        const product = await Product.findByIdAndUpdate( id, data, {new: true});
        
        res.status(200).json( product );
    } catch (err) {
        res.status(500).json({ msg: 'Ocurrio un error en el servidor'});
    }
}

const deleteProduct = async ( req = request, res = response ) => {
    try {
        console.log('delete');
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true});
        res.status(200).json( product );
    } catch (err) {
        res.status(500).json({ msg: 'Ocurrio un error en el servidor'});
    }
}

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}