const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        
        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            users:      '/api/users',
            products:   '/api/products',
            buscar:     '/api/search'
        }
        
        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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
        this.app.use( this.paths.users, require('../routes/user.routes') );
        this.app.use( this.paths.auth, require('../routes/auth.routes') );
        this.app.use( this.paths.categories, require('../routes/category.routes') );
        this.app.use( this.paths.products, require('../routes/product.routes') );
        this.app.use( this.paths.buscar, require('../routes/buscar.routes') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port );
        });
    }
}

module.exports =Server;