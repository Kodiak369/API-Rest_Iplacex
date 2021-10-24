'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PacienteSchema = Schema({
    rut: String,
    nombre: String,
    edad: String,
    sexo: String,
    enfermedad: String,
    revisado: String,
    fechaIngreso: { type: Date, default: Date.now },
    fotoPersonal: String
});

module.exports = mongoose.model('Paciente', PacienteSchema);