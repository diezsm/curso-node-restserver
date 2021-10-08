
const { Router} = require('express');
const { usuariosGet, usuariosPUT, usuariosPOST, usuariosDELETE } = require('../controllers/user');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', usuariosPUT);

router.post('/', usuariosPOST);

router.delete('/', usuariosDELETE);    


module.exports = router;







