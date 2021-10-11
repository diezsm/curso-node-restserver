const { Router} = require('express');
const { check, query } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, borraProducto } = require('../controllers/productos');

const {  existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');




const { validarCampos,  validarJWT, esAdminRole } = require('../middlewares');


const router = Router();
/**
 * {{url}}/api/categorias
 */


// Obtener todos los productos - publico
router.get('/', [
    query('desde', 'El valor del query desde debe de ser un valor numérico')
    .if(query('desde').exists()).isNumeric(),

    query('limite', 'El valor del query limite debe de ser un valor numérico')
    .if(query('limite').exists()).isNumeric(),
    validarCampos
], obtenerProductos)

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProductoPorId)

// Crear un producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto)

// Actualizar un registro por id - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    //check('categoria','No es un id de Mongo').isMongoId(),
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],actualizarProducto)

// Borrar un producto por id - privado - ADMIN_ROLE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],borraProducto)




module.exports = router;