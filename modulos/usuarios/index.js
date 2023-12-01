const db = require('../../database/db');
const control = require('./controlador');

module.exports = control(db);