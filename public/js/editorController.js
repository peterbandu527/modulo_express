/*var ace = require('ace-builds/src-noconflict/ace');
require('ace-builds/src-noconflict/mode-javascript');
require('ace-builds/src-noconflict/theme-monokai');
*/

let btn_editor = document.getElementById("btn_editor");
let iframe = document.getElementById("output");
var selector_page = document.getElementById("select_page");
var data;
var contenido;
var url;

const db = require("../../database/db");
ace.require("ace/ext/language_tools");
let editor = ace.edit("editor");
editor.session.setMode("ace/mode/html");
editor.setTheme("ace/theme/monokai");

console.log(db);

fetch("/getpaginas")
  .then((response) => response.json())
  .then((datos) => {
    data = datos;
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });

editor.setOptions({
  fontsize: "16px",
  showLineNumbers: true,
  vScrollBarAlwaysVisible: true,
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

btn_editor.addEventListener("click", function () {
    let editor_web = document.getElementById("editor_web"); 
    
    editor_web.classList.toggle('d-none');
    editor_web.classList.toggle('d-block');
});

// btnRun.addEventListener("click", function () {
//   const text = editor.getValue();
//   iframe.src = "data:text/html; charset=utf-8, " + encodeURI(text);
// });

// btnLive.addEventListener("change", function () {
//   if (btnLive.checked) {
//     editor.session.on("change", function () {
//       const text = editor.getValue();
//       iframe.src = "data:text/html; charset=utf-8, " + encodeURI(text);
//     });
//   }
// });

selector_page.addEventListener("change", function () {
  url = selector_page.value;  
  var array = data.urlsWithContent;
  contenido = '';  
  array.forEach(element => {
    if(url == element.url){
        contenido = element.contenido
    }
  });  
  editor.setValue(contenido);
  iframe.src = url;
});

btnSave.addEventListener("click", function(){
    let datos_nuevos = editor.getValue();    
    
    const datosParaEnviar = {
        // Agrega los datos que deseas enviar al servidor
        url: url,
        contenido: datos_nuevos,
        // ...
    };        
    fetch('/actualizar_pagina', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(datosParaEnviar), 
    })
    .then((response) => response.json())
    .then((respuestaServidor) => {
        console.log('Respuesta del servidor:', respuestaServidor);
    })
    .catch((error) => {
        console.error('Error al enviar datos al servidor:', error);
    });
    iframe.src = iframe.src;
});
