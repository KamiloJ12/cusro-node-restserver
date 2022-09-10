const { response, request } = require('express');

const userGet = (req = request, res = response) => {
    const { query } = req;
    res.status(200).json({
        msg: 'get API - controller',
        query
    });
}

const userPost = (req, res = response) => {
    const { body: {nombre, edad} } = req;
    res.status(200).json({
        msg: 'post API - controller',
        nombre,
        edad
    });
}

const userPut = (req, res = response) => {
    const { params: {id} } = req;
    res.status(200).json({
        msg: 'put API - controller',
        id
    });
}

const userDelete = (req, res = response) => {
    res.status(200).json({
        msg: 'delete API - controller'
    });
}

const userPatch = (req, res = response) => {
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