const express = require('express');
const router = express();

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/contacto',(req,res)=>{
    res.send('Contacto');
});

router.get('/services',(req,res)=>{
    res.render('services');
});

router.get('/noticias',(req,res)=>{
    res.render('noticias');
});

router.get('/rectorado',(req,res)=>{
    res.render('rectorado');
});

router.get('/pregrado',(req,res)=>{
    res.render('pregrado');
});

module.exports = router;