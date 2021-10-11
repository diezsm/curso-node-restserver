const { Router} = require('express');
const { check, query } = require('express-validator');
const { buscar } = require('../controllers/buscar');


const router = Router();

router.get('/:coleccion/:termino', buscar);

module.exports = router;