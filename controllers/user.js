const { response, request} = require('express');


const usuariosGet = (req = request, res = response) => {
    //res.send('Hello World')

    const { q, nombre = 'No name', apikey} = req.query;

    res.json({
        ok: true,
        msg:' get API - controlador',
        q, nombre, apikey
    });
}
const usuariosPOST = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg:' post API - controlador',
        nombre, edad
    });
}
const usuariosPUT = (req, res = response) => {

    const id = req.params.id;

    res.json({
        ok: true,
        msg:' put API - controlador',
        id
    });
}
const usuariosDELETE = (req, res = response) => {

    res.json({
        ok: true,
        msg:' delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPOST,
    usuariosPUT,
    usuariosDELETE,

}