const { Router} = require('express');
const { check, query } = require('express-validator');

const { obtenerCategorias,crearCategoria, obtenerCategoriasPorId, actualizarCategoria, borraCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');




const { validarCampos,  validarJWT, esAdminRole } = require('../middlewares');




const router = Router();
/**
 * {{url}}/api/categorias
 */


// Obtener todas las categorias - publico
router.get('/', [
    query('desde', 'El valor del query desde debe de ser un valor numérico')
    .if(query('desde').exists()).isNumeric(),

    query('limite', 'El valor del query limite debe de ser un valor numérico')
    .if(query('limite').exists()).isNumeric(),
    validarCampos
], obtenerCategorias)

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoriasPorId)

// Crear una categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar un registro por id - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],actualizarCategoria)

// Borrar una categoria por id - privado - ADMIN_ROLE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],borraCategoria)




module.exports = router;