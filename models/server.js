const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';
        //Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    middlewares() {

        // Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public') );
    } 

    routes() {
        // this.app.get('/api',(req,res) => res.send('Hello World') );
        // this.app.get('/api',(req,res) => res.json('Hello World') );
        this.app.use( this.usersPath, require('../routes/user.routes') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port );
        });
    }
}

module.exports =Server;