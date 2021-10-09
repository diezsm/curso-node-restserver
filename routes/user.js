
const { Router} = require('express');
const { check, query } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const { usuariosGet, usuariosPUT, usuariosPOST, usuariosDELETE } = require('../controllers/user');

const router = Router();

//Aca se validan los params
router.get('/', [
    query('desde', 'El valor del query desde debe de ser un valor numérico')
    .if(query('desde').exists()).isNumeric(),

    query('limite', 'El valor del query limite debe de ser un valor numérico')
    .if(query('limite').exists()).isNumeric(),
    validarCampos
],usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRolValido ),
    validarCampos
],usuariosPUT);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('name', 'El nombre tiene caracteres inválidos').matches(/^[a-zA-Z\s]+$/i),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPOST);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDELETE);    

module.exports = router;







