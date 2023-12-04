const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');


router.get('/',todos);
router.get('/:id',uno);
router.put('/',eliminar);
router.post('/',agregar);

async function todos (req,res,next){    
    try{        
        const items = await controlador.todos();
        respuesta.success(req, res, items.rows,200);  
    }catch(error){
        next(error);
    }  
};

async function uno (req,res,next){
    try{        
        const items = await controlador.uno(req.params.id);
        respuesta.success(req, res, items.rows,200);   
    }catch(error){
        next(error);   
    }     
};

async function eliminar (req,res,next){
    try{        
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'items eliminado satisfactoriamente',200);   
    }catch(error){
        next(error);
    }     
};

async function agregar (req,res,next){
    try{        
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0){
            mensaje = 'Item guardado con exito';
        }else{
            mensaje = 'Item actualizado con exito';
        }
        respuesta.success(req, res, mensaje,201);   
    }catch(error){
        next(error);
    }     
};


module.exports = router;