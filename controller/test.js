'use strict'

var validator = require('validator');
var prod = require('../models/Paciente');
var fs = require('fs');
var path = require('path');

var controller = {
    test: (request, response) => {
        var mensaje = request.body.mensaje;

        return response.status(200).send({
            curso: 'Multiplataforma Nativa',
            autor: 'Jaime',
            mensaje
        });
    },

    save: (request, response) => {
        var params = request.body;
        try {
            var rutValidado = !validator.isEmpty(params.rut);
            var nombreValidado = !validator.isEmpty(params.nombre);
            var edadValidado = !validator.isEmpty(params.edad);
            var sexoValidado = !validator.isEmpty(params.sexo);
            var enfermedadValidado = !validator.isEmpty(params.enfermedad);
            var revisadoValidado = !validator.isEmpty(params.revisado);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: 'Faltan Datos ' + error
            });
        }

        if (rutValidado && nombreValidado && edadValidado && sexoValidado && enfermedadValidado && revisadoValidado) {

            var paciente = new prod();

            paciente.rut = params.rut;
            paciente.nombre = params.nombre;
            paciente.edad = toString(params.edad);
            paciente.sexo = params.sexo;
            paciente.enfermedad = params.enfermedad;
            paciente.revisado = params.revisado;

            if (params.imagen) {
                paciente.imagen = params.imagen;
            } else {
                paciente.imagen = null;
            }

            paciente.save((err, pacienteGuardado) => {
                if (err || !pacienteGuardado) {
                    return response.status(404).send({
                        status: 'error',
                        message: 'No se ha guardado el paciente'
                    });
                }

                return response.status(200).send({
                    status: 'success',
                    pacienteGuardado
                });
            });
        } else {
            return response.status(200).send({
                status: 'error',
                message: 'Los datos ingresados no son validos'
            });
        }
    },

    getPacientes: (request, response) => {
        var query = prod.find({})
        var ultimospacientes = request.params.last;

        if (ultimospacientes || ultimospacientes != undefined) {
            query.limit(5);
        }

        query.sort('-_id').exec((err, pacientes) => {
            if (err) {
                return response.status(500).send({
                    status: 'error',
                    message: 'No se pudieron obtener los pacientes'
                });
            }
            if (!pacientes) {
                return response.status(404).send({
                    status: 'error',
                    message: 'No se pudieron obtener los pacientes a mostrar'
                });
            }
            return response.status(200).send({
                status: 'success',
                pacientes
            });

        });
    },

    getPacientePorId: (request, response) => {
        var id = request.params.id;

        if (!id || id == null) {
            return response.status(404).send({
                status: 'error',
                message: 'El paciente no se encontro'
            });
        }

        prod.findById(id, (err, paciente) => {
            if (err || !paciente) {
                return response.status(404).send({
                    status: 'error',
                    message: 'No existe paciente'
                });
            }

            return response.status(200).send({
                status: 'success',
                paciente
            });
        });
    },

    actualizarPaciente: (request, response) => {
        var id = request.params.id;
        var params = request.body;

        try {
            var rutValidado = !validator.isEmpty(params.rut);
            var nombreValidado = !validator.isEmpty(params.nombre);
            var edadValidado = !validator.isEmpty(params.edad);
            var sexoValidado = !validator.isEmpty(params.sexo);
            var enfermedadValidado = !validator.isEmpty(params.enfermedad);
            var revisadoValidado = !validator.isEmpty(params.revisado);

        } catch (error) {
            return response.status(400).send({
                status: 'error',
                message: 'Faltan datos'
            });
        }

        if (rutValidado && nombreValidado && edadValidado && sexoValidado && enfermedadValidado && revisadoValidado) {
            prod.findOneAndUpdate({ _id: id }, params, { new: true }, (err, pacienteActualizado) => {
                if (err) {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if (!pacienteActualizado) {
                    return response.status(400).send({
                        status: 'error',
                        message: 'No existe este paciente'
                    });
                }
                return response.status(200).send({
                    status: 'success',
                    pacienteActualizado
                });
            });

        } else {
            return response.status(400).send({
                status: 'error',
                message: 'Validacion incorrecta'
            });
        }
    },

    eliminarPaciente: (request, response) => {
        var id = request.params.id;
        prod.findOneAndDelete({ _id: id }, (err, pacienteBorrado) => {
            if (err) {
                return response.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }
            if (!pacienteBorrado) {
                return response.status(400).send({
                    status: 'error',
                    message: 'No existe este paciente o ya fue borrado'
                });
            }
            return response.status(200).send({
                status: 'success',
                message: pacienteBorrado
            });
        });
    },

    buscarPaciente: (request, response) => {
        var busqueda = request.params.search;

        prod.find({
            "$or": [
                { "nombre": { "$regex": busqueda, "$options": "i" } },
                { "rut": { "$regex": busqueda, "$options": "i" } }
            ]
        }).sort([['fechaIngreso', 'descending']]).exec((err, pacienteEncontrado) => {
            if (err) {
                return response.status(500).send({
                    status: 'error',
                    message: 'No se ha encontrado el paciente'
                });
            }
            if (!pacienteEncontrado || pacienteEncontrado.length <= 0) {
                return response.status(400).send({
                    status: 'error',
                    message: 'No coinciden los criterios'
                });
            }
            return response.status(200).send({
                status: 'success',
                pacienteEncontrado
            });
        })
    },

    subirImagen: (request, response) => {
        var filename = 'Imagen no  se ha cargado';

        if (!request.files) {
            return response.status(404).send({
                status: 'error',
                message: filename
            });
        }

        var filePath = request.files.file0.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var fileExtensionSplit = fileName.split('\.');
        var fileExtension = fileExtensionSplit[1];

        if (fileExtension != 'png' && fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension != 'gif') {
            fs.unlink(filePath, (err) => {
                return response.status(200).send({
                    status: 'error',
                    message: 'La extension no es soportada'
                });
            });
        } else {
            var id = request.params.id;
            prod.findOneAndUpdate({ _id: id }, { imagen: filename }, { new: true }, (err, imagenSubida) => {
                if (err || !imagenSubida) {
                    return response.status(404).send({
                        status: 'error',
                        message: 'La imagen no se pudo guardar'
                    });
                }
                return response.status(200).send({
                    status: 'error',
                    message: imagenSubida
                });
            });
        }
    },

    obtenerImagen: (request, response) => {
        var file = request.params.imagen;
        var pathFile = './uploads/imagenes/' + file;
        console.log(pathFile);
        fs.access(pathFile, (exists) => {
            if (exist) {
                return response.sendFile(path.resolve(pathFile));
            } else {
                return response.status().send({
                    status: 'error',
                    message: 'La imagen no existe o no se encontro el recurso'
                })
            }
        });
    }

}

module.exports = controller;
