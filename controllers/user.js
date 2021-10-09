const { response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {
    //res.send('Hello World')

    //const { q, nombre = 'No name', apikey} = req.query;
    const{ limite = 5, desde = 0 } = req.query;
    const query = { estado: true};
   
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);
    
    res.json({
        //ok: true,
        //msg:' get API - controlador',
        //q, nombre, apikey
        total,
        usuarios
        
    });
} 
const usuariosPOST = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol}  );

    //Encriptar la contraseña
    /**
     * 
     * formar para verificar que las password tiene distinto caracteres
     * .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/ )
     * 
     */
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    //Guardar en BD
    await usuario.save();

    res.json({
        //ok: true,
        //msg:' post API - controlador',
        usuario
    });
}
const usuariosPUT = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto} = req.body;

    //TODO validar contra base de datos


    if ( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        //ok: true,
        //msg:' put API - controlador',
        usuario
    });
}
const usuariosDELETE = async(req, res = response) => {

    const { id } = req.params;
    //Fisicamente lo borramos    
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false}); 

    res.json({
        //ok: true,
        //msg:' delete API - controlador',
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPOST,
    usuariosPUT,
    usuariosDELETE,

}