'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PacienteSchema = Schema({
    rut: String,
    nombre: String,
    edad: Number,
    sexo: String,
    enfermedad: String,
    revisado: Boolean,
    fechaIngreso: { type: Date, default: Date.now },
    fotoPersonal: String
});

module.exports = mongoose.model('Paciente', PacienteSchema);