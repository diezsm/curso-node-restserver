const { response } = require("express");
const{ ObjectId } = require('mongoose').Types;

const { Usuario, Producto, Categoria } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productoporcategoria',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid( termino )

    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        res.json({
            results: ( usuario ) ? [ usuario] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({ 
        $or:[
            {nombre: regexp},
            {correo: regexp}
        ],
        $and: [{ estado: true}]
        
    })
    

    res.json({
        results: usuarios
    });
}
const buscarCategorias = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid( termino )

    if( esMongoID ){
        const categoria = await Categoria.findById(termino);
        res.json({
            results: ( categoria ) ? [ categoria] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ 
        nombre: regexp,
        estado: true
    })
    .populate('usuario', 'nombre');
    

    res.json({
        results: categorias
    });
}
const buscarProductos = async(termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid( termino )

    if( esMongoID ){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        res.json({
            results: ( producto ) ? [ producto] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const productos = await Producto.find({ 
        nombre: regexp,
        estado: true
    })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');
    

    res.json({
        results: productos
    });
}

const buscar = ( req, res = response) =>{

    const{ coleccion, termino} = req.params;

    if ( !coleccionesPermitidas.includes(coleccion )) {
        return res.status(400).json({
            msg:`Las colecciones permitadas son ${ coleccionesPermitidas }`
        });
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
    
        case 'categorias':
            buscarCategorias(termino, res);
            break;
    
        case 'productos':
            buscarProductos(termino, res);
            break;
    
        case 'productoporcategoria':
            buscarProductoPorCategoria(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg:'Se me olvido hacer esta búsqueda'
            });
            break;
    }

}


const buscarProductoPorCategoria= async( termino = '', res = response) => {
 
    const isMongoId = ObjectId.isValid(termino); // true or false
 
    if (isMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex = RegExp(termino, 'i'); //sera una busqueda insensible (no estricta)
    if(termino === ''){
        res.json({
            msg: 'Debe ingresar una búsqueda'
        })
    }
    const categoria = await Categoria.find({
        nombre: regex,
        estado: true
    })

    if(!categoria[0] ){
        return res.status(400).json({
            msg: 'Esta categoría no existe'
        })
    }
    const productos =  await Producto.find( {
        categoria: categoria[0]._id,
        estado: true
    } )
    .populate('categoria','name')
    .populate('usuario','name')
    
    if(!productos[0] ){
        return res.status(400).json({
            msg: 'No se encontraron productos'
        })
    }
    res.json({
        results: productos
    })
 
}
module.exports = {
    buscar
}