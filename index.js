'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port=3900;

// mongoose.set('useFindAndModify', false); //ya no se usa...
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/productos', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexion se realizo correctamente con MongoDB');
        app.listen(port, () => {
            console.log(`El servidor esta escuchando en http://localhost:`+port);
        });
    });