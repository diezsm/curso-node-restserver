const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");


const { subirArchivo } = require("../helpers");

const { Usuario, Producto} = require('../models');

const cargarArchivo = async(req, res = response) => {

    //let sampleFile;
    //let uploadPath;
    console.log('req.files >>>', req.files); // eslint-disable-line
  
    try {

        //Imagenes
        //const nombre = await subirArchivo( req.files );
        // const nombre = await subirArchivo( req.files, undefined, 'textos');
        //Textos
        //const nombre = await subirArchivo( req.files, ['txt','md'],'textos' );

        const nombre = await subirArchivo( req.files, undefined, 'img');

        res.json({
            nombre
        });
    } catch (msg) {
        res.status(400).json({msg})
    }

    
     
}

const actualizarImagen = async( req, res = response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }


    //Limpiar imágenes previas
    try {
        if( modelo.img ){
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
            if( fs.existsSync (pathImagen ) ){
                fs.unlinkSync( pathImagen );
            }
        }
        
    } catch (error) {
        res.status(500).json( error );
    }
    modelo.img = await subirArchivo( req.files, undefined, coleccion);
    
    await modelo.save();
    
    res.json( modelo );

}
const actualizarImagenCloudinary = async( req, res = response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }


    //Limpiar imágenes previas
    try {
        if( modelo.img ){
            // TODO: Hay que borrar la imagen del servidor
            const nombreArr     = modelo.img.split('/');
            const nombre        = nombreArr[ nombreArr.length - 1];
            const[ public_id ]  = nombre.split('.');

            cloudinary.uploader.destroy( public_id);
        }
        
    } catch (error) {
        res.status(500).json( error );
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;
    
    await modelo.save();
    
    res.json( modelo );

}

const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }


    //Verificar imagen previas
    try {
        if( modelo.img ){
            //Verificar si existe la imagen
            const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
            if( fs.existsSync (pathImagen ) ){
                return res.sendFile(pathImagen);
            }
        }
        
    } catch (error) {
        res.status(500).json( error );
    }

    const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
    return res.sendFile(pathImagen);
    //res.json({ msg: pathImagen});

}

const mostrarImagenCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }


    //Verificar imagen previas
    try {
        if( modelo.img ){
            //Verificar si existe la imagen
            /**
            return res.json({
                img: modelo.img
            });
            */
            return res.redirect(modelo.img);
        }
        
    } catch (error) {
        res.status(500).json( error );
    }

    const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
    return res.sendFile(pathImagen);
    //res.json({ msg: pathImagen});

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
    mostrarImagenCloudinary
}