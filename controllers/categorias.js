const { response } = require("express");
const { Categoria } = require('../models');

const crearCategoria = async( req, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( { nombre });
    
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    //genera la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    
    //guardar en BD
    await categoria.save();

    res.status(201).json(categoria);
}

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req, res = response) =>{
    const{ limite = 5, desde = 0 } = req.query;
    const query = { estado: true};
   
    const [total, categoria] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .populate('usuario', 'nombre')
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);
    
    res.json({
        total,
        categoria
        
    });
}
//obtenerCategoria -  populate
const obtenerCategoriasPorId = async( req, res = response) =>{

    const { id } = req.params

    const categoria = await Categoria.findById( id, {estado: true} );
    
    res.json({
        categoria
    });
}
//actualizarCategoria
const actualizarCategoria = async( req , res = response) =>{
    const { id } = req.params;
    const { _id, estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        categoria
    });
}
//borraCategoria
const borraCategoria = async( req , res = response) =>{
    
    const { id } = req.params;
    const { usuario } = req.body;


    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false, usuario}, { new: true});

    res.json({
        categoria
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasPorId,
    actualizarCategoria,
    borraCategoria
}