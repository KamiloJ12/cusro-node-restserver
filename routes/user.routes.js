const { Router } = require('express');
const { check } = require('express-validator');

// const { validarJWT } = require('../middlewares/validar-jwt');
// const { isAdminRole, isRole } = require('../middlewares/validar-roles');
// const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, isRole, validarCampos } = require('../middlewares');

const { isRoleValid, existsEmail, existsUserById } = require('../helpers/db-validator');
const { userGet, userPost, userPut, userDelete, userPatch } = require('../controller/user.controller');

const router = Router();

router.get('/', userGet);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'The password must be at least six characters').isLength({ min: 6 }),
    check('email', 'Email is invalid').isEmail(),
    //check('role', 'Role is invalid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isRoleValid ),
    check('email').custom( existsEmail ), 
    validarCampos
], userPost);

router.put('/:id', [
    check('id', 'Id is invalid').isMongoId(),
    check('id').custom( existsUserById ),
    check('role').custom( isRoleValid ),
    validarCampos
],userPut);

router.delete('/:id', [
    validarJWT,
    //isAdminRole,
    isRole('ADMIN_ROLE', 'VENDOR_ROLE'),
    check('id', 'Id is invalid').isMongoId(),
    check('id').custom( existsUserById ),
    validarCampos
],userDelete);

router.patch('/', userPatch);

module.exports = router;     