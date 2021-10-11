const { response } = require("express");
const { Producto } = require('../models');

const crearProducto = async( req, res = response) =>{

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne( { nombre: body.nombre });
    
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        });
    }

    //genera la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }

    const producto = new Producto( data );
    
    //guardar en BD
    await producto.save();

    res.status(201).json(producto);
}

//obtenerProductos - paginado - total - populate
const obtenerProductos= async( req, res = response) =>{
    const{ limite = 5, desde = 0 } = req.query;
    const query = { estado: true};
   
    const [total, productos] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);
    
    res.json({
        total,
        productos
        
    });
}
//obtenerProducto -  populate
const obtenerProductoPorId = async( req, res = response) =>{

    const { id } = req.params

    const producto = await Producto.findById( id );
    
    res.json({
        producto
    });
}
//actualizarProducto
const actualizarProducto= async( req , res = response) =>{
    const { id } = req.params;
    const { _id, estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        producto
    });
}
//borraProducto
const borraProducto = async( req , res = response) =>{
    
    const { id } = req.params;
    const { usuario } = req.body;


    const producto = await Producto.findByIdAndUpdate( id, { estado: false, usuario}, { new: true});

    res.json({
        producto
    });
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borraProducto,
    crearProducto,
}