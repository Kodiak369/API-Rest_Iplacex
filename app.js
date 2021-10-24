'use strict'

var express = require('express');
var routers = require('./routes/routes');

var app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', routers);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/test', function (request, response) {
    return response.status(200).send('Esto es un test')
});


module.exports = app;