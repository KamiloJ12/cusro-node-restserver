const { Category, Role, User, Product } = require('../models');

const isRoleValid = async (role = '') => {
    const existsRole = await Role.findOne({role});
    if( !existsRole ) {
        throw new Error(`The role '${role}' is invalid`);
    }
}

const existsEmail = async ( email = '' ) => {
    const existeEmail = await User.findOne({ email });
    if( existeEmail ) {
        throw new Error(`The email ${email} is registered`);
    }
}

const existsUserById = async ( id = '' ) => {
    const existsUserById = await User.findById( id );
    if( !existsUserById ) {
        throw new Error(`The user with id ${id} does not exist`);
    }
}

const existsCategoryById = async ( id = '' ) => {
    const existsCategoryById = await Category.findById( id );
    if( !existsCategoryById ) {
        throw new Error(`The category with id ${id} does not exist`);
    }
}

const existsProductById = async ( id ) => {
    const existsProductById = await Product.findById( id );
    if( !existsProductById ) {
        throw new Error(`The product with id ${id} does not exist`);
    }
}

module.exports = {
    isRoleValid,
    existsEmail,
    existsUserById,
    existsCategoryById,
    existsProductById
}