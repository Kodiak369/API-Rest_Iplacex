'use strict'

var express = require('express');
var controller = require('../controller/test');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads/imagenes' });

// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/imagenes/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, "nombre" + Date.now() + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });


var router = express.Router();


router.get('/testController', controller.test)

router.post('/guardarPaciente', controller.save);
router.get('/obtenerPacientes/:last?', controller.getPacientes);
router.get('/obtenerPacientePorId/:id', controller.getPacientePorId);
router.put('/actualizarPaciente/:id', controller.actualizarPaciente);
router.delete('/eliminarPaciente/:id', controller.eliminarPaciente);
router.get('/buscarPaciente/:search', controller.buscarPaciente);
router.post('/subirImagen/:id?', multipartMiddleware, controller.subirImagen);
router.get('/obtenerImagen/:imagen', controller.obtenerImagen);

module.exports = router;


