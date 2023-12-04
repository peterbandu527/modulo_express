/*var ace = require('ace-builds/src-noconflict/ace');
require('ace-builds/src-noconflict/mode-javascript');
require('ace-builds/src-noconflict/theme-monokai');
*/
let btnReset = document.getElementById("btnReset");
let btnRun = document.getElementById("btnRun");
let btnLive = document.getElementById("btnLive");
let iframe = document.getElementById("output");
var selector_page = document.getElementById("select_page");

const db = require("../../database/db");
ace.require("ace/ext/language_tools");
let editor = ace.edit("editor");
editor.session.setMode("ace/mode/html");
editor.setTheme("ace/theme/monokai");

console.log(db);

editor.setOptions({
    fontsize: "16px",
    showLineNumbers: true,
    vScrollBarAlwaysVisible: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

btnReset.addEventListener("click", function(){
    editor.setValue("");
    iframe.src = "";
});

btnRun.addEventListener("click",function(){
    const text = editor.getValue();
    iframe.src = "data:text/html; charset=utf-8, " + encodeURI(text);
});

btnLive.addEventListener("change", function(){
    if(btnLive.checked){
        editor.session.on("change", function(){
            const text = editor.getValue();
            iframe.src = "data:text/html; charset=utf-8, " + encodeURI(text);
        })
    }
});

selector_page.addEventListener("change", function(){ 
    var url = selector_page.value;   
    console.log(url);
    let tabla = "paginas";
    db.pagina(tabla, pagina)
    .then((result) => {           
      const contenido = result.rows[0].contenido;          
      console.log(contenido);
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al recuperar los datos de la base de datos");
    });
});