
const { Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre:{
        type: String,
        unique:true,
        require:[true, 'El nombre es obligatorio']
    },
    estado:{
        type: Boolean,
        default: true,
        require:true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require:true
    }
});

CategoriaSchema.methods.toJSON = function(){
    const { __v,_id, estado, ...categoria} = this.toObject();
    //usuario.uid = _id;
    return categoria;

}

module.exports = model ('Categoria', CategoriaSchema)



