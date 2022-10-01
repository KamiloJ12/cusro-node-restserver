const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, isRole, validarCampos, } = require('../middlewares')
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct } = require('../controller/products.controller');
const { existsProductById, existsCategoryById } = require('../helpers/db-validator');

const router = Router();

router.get('/', getProducts );

router.get('/:id', [
    check('id', 'MondoId is invalid').isMongoId(),
    check('id').custom( existsProductById ),
    validarCampos
], getProduct );

router.post('/', [
    validarJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('category', 'The category is not MongoId').isMongoId(),
    check('category').custom( existsCategoryById ),
    validarCampos
], createProduct );

router.put('/:id', [
    validarJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'The id is not MongoId').isMongoId(),
    validarCampos
], updateProduct );

router.delete('/:id', [
    validarJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'The id is not MongoId').isMongoId(),
    validarCampos
], deleteProduct );

module.exports = router;