const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, isRole, validarCampos } = require('../middlewares');
const { createCategory, getCategories, getCategory } = require('../controller/categories.controller');
const { existsCategoryById } = require('../helpers/db-validator');

const router = Router(); 

router.get('/', getCategories );

router.get('/:id', [
    check('id', 'No es un Id de MongoDB').isMongoId(),
    //check('id').custom( existsCategoryById ),
    validarCampos
], getCategory );

router.post('/', [
    validarJWT,
    check('name', 'The name is required').not().isEmpty(),
    validarCampos
], createCategory);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id de MongoDB').isMongoId(),
    check('id').custom( existsCategoryById ),
    validarCampos
],(req, res) => {
    res.json( 'put' );
});

router.delete('/:id', [
    validarJWT,
    isRole('ADMIN_ROLE'),
    check('id', 'No es un Id de MongoDB').isMongoId(),
    check('id').custom( existsCategoryById ),
    validarCampos
],(req, res) => {
    res.json( 'estado - false (delete)' );
});


module.exports = router;