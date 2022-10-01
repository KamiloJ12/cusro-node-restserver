const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controller/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password is requried').not().isEmpty(), 
    validarCampos
], login );

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validarCampos
], googleSingIn );

module.exports = router;
