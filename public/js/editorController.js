/*var ace = require('ace-builds/src-noconflict/ace');
require('ace-builds/src-noconflict/mode-javascript');
require('ace-builds/src-noconflict/theme-monokai');
*/

let btn_editor = document.getElementById("btn_editor");
let iframe = document.getElementById("output");
var selector_page = document.getElementById("select_page");
var select_language = document.getElementById("select_language");

var data;
var contenido;
var url;

ace.require("ace/ext/language_tools");
let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");

editor.setOptions({
  fontsize: "16px",
  showLineNumbers: true,
  vScrollBarAlwaysVisible: true,
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});

select_language.addEventListener("change", function () {
  let selected = select_language.value;
  console.log(selected);
  if (selected == "html") {
    editor.setValue("");
    editor.setOptions({
      fontsize: "16px",
      showLineNumbers: true,
      vScrollBarAlwaysVisible: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
    selector_page.style.display = "block";
    editor.session.setMode("ace/mode/html");
  }
  if (selected == "css") {
    editor.setValue("");
    editor.setOptions({
      fontsize: "16px",
      showLineNumbers: true,
      vScrollBarAlwaysVisible: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
    selector_page.style.display = "none";
    editor.session.setMode("ace/mode/css");

    fetch("/get-css")
      .then((response) => response.text())
      .then((cssContent) => {
        editor.setValue(cssContent); // Establece el contenido en el editor
      })
      .catch((error) =>
        console.error("Error al obtener el contenido del archivo CSS:", error)
      );
  }
});

fetch("/getpaginas")
  .then((response) => response.json())
  .then((datos) => {
    data = datos;
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });

btn_editor.addEventListener("click", function () {
  let editor_web = document.getElementById("editor_web");

  editor_web.classList.toggle("d-none");
  editor_web.classList.toggle("d-block");
});

selector_page.addEventListener("change", function () {
  url = selector_page.value;
  var array = data.urlsWithContent;
  contenido = "";
  array.forEach((element) => {
    if (url == element.url) {
      contenido = element.contenido;
    }
  });
  editor.setValue(contenido);
  iframe.src = url;
});

btnSave.addEventListener("click", function () {
  let datos_nuevos = editor.getValue();
  let selected = select_language.value;
  if (selected == "html") {
    const datosParaEnviar = {
      // Agrega los datos que deseas enviar al servidor
      url: url,
      contenido: datos_nuevos,
      // ...
    };
    fetch("/actualizar_pagina", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosParaEnviar),
    })
      .then((response) => response.json())
      .then((respuestaServidor) => {
        console.log("Respuesta del servidor:", respuestaServidor);
      })
      .catch((error) => {
        console.error("Error al enviar datos al servidor:", error);
      });
    iframe.src = iframe.src;
  }
  if (selected == "css") {
    let editedCSS = editor.getValue();
    fetch("/actualizar_css", {
      method: "POST",      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedCSS),
    })
      .then((response) => response.json())
      .then((usuario) => {
        console.log("¡Ok!");
      })
      .catch((error) => {
        console.log("Error: " + error);
      });

    iframe.src = iframe.src;
  }
});
