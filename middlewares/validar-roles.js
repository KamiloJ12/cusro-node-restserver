const { request, response } = require('express');

const isAdminRole = (req = request, res = response, next) => {
    const { user } = req;
    if( !user ) {
        return res.status(500).json({
            msg: 'Error in validating role'
        }); 
    }

    const { name, role } = user;
    if( role != 'ADMIN_ROLE' ) {
        return res.status(400).json({
            msg: `${ name } is not an admin`
        });
    }
    next();
}

const isRole = ( ...roles ) => {
    return ( req = request, res = response, next ) => {
        const { user } = req;
        if( !user ) {
            return res.status(500).json({
                msg: 'Error in validating role'
            }); 
        }

        const { name, role } = user;
        if( !roles.includes(role) ) {
            return res.status(400).json({
                msg: `${ name } is not ${ roles }`
            });
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    isRole
}