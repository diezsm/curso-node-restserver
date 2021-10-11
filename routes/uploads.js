const { Router} = require('express');
const { check, query } = require('express-validator');


const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/uploads');
const { coleccionPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/',[
    validarArchivoSubir,
    validarCampos
] ,cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionPermitidas (c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);
//actualizarImagen);

router.get('/:coleccion/:id',[
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionPermitidas (c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagenCloudinary);
//mostrarImagen);

module.exports = router;