const express = require("express");
const router = express();
const db = require("./database/db");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const PassportLocal = require("passport-local").Strategy;

router.use(cookieParser("mi secreto"));
router.use(cors()); 
router.use(bodyParser.text({ type: "text/plain" }));
router.use(
  session({
    secret: "mi secreto",
    resave: true,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());


const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, './public/medios');
  },
  filename: (req, file, cb) =>{
    const ext =file.originalname.split('.').pop();
    cb(null, `${file.originalname}`);
  }
});
const upload = multer({ storage:storage });
router.post('/upload',upload.single('file'),(req,res) =>{
  try {
    const tabla = 'medios_dinamicos'
    const file = fs.readFileSync(req.file.path);        
    const base64 = file.toString('base64');    
    const name = req.file.originalname;  
    const mimetype = req.file.mimetype;        
    db.agregar_img64(tabla,base64,name,mimetype);
    
    res.redirect('/subida');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al subir el archivo');
  }
});


passport.use(
  new PassportLocal(function (username, password, done) {
    db.usuario("usuarios", username)
      .then((result) => {
        if (result.rows.length === 0) {
          return done(null, false);
        }
        const user = result.rows[0];
        if (user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((error) => {
        return done(error);
      });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.uno("usuarios", id)
    .then((result) => {
      if (result.rows.length === 0) {
        return done(null, false);
      }
      const user = result.rows[0];
      return done(null, user);
    })
    .catch((error) => {
      return done(error);
    });
});

router.get(
  "/dashboard",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  },
  (req, res) => {
    let tabla = "paginas";
    db.cantidad_pagina(tabla)
      .then((result) => {
        const urls = [];
        urls.push("--");
        const rows = result.rows;
        rows.forEach((resultado) => {
          urls.push(resultado.url);
        });

        res.render("dashboard", { page: "Dashboard", list: urls });
      })
      .catch((error) => {
        console.log(error);
        res.send("Error al recuperar los datos de la base de datos");
      });
  }
);
router.get("/getpaginas", (req, res) => {
  let tabla = "paginas";
  db.cantidad_pagina(tabla).then((result) => {
    const urlsWithContent = [];
    const rows = result.rows;
    rows.forEach((resultado) => {
      const url = resultado.url;
      const contenido = resultado.contenido;
      urlsWithContent.push({ url, contenido });
    });
    res.json({ urlsWithContent });
  });
});

router.get("/getmedios", (req, res) => {
  let tabla = "medios_dinamicos";
  db.cantidad_pagina(tabla).then((result) => {
    const mediacontent = [];    
    const rows = result.rows;        
    rows.forEach((resultado) => {
      const name = resultado.name;
      const contenido = resultado.base64;
      const mimetype = resultado.type;
      mediacontent.push({ name, contenido,mimetype });
    });
    res.json({ mediacontent });
  });
});

router.post("/actualizar_pagina", (req, res) => {
  const datosRecibidos = req.body;
  const tabla = "paginas";
  db.actualizar_pagina(tabla, datosRecibidos).then((result) => {
    console.log("Datos subidos correctamente");
  });
  res.json({ mensaje: "Datos recibidos correctamente" });
});

router.get("/get-css", (req, res) => {
  const fs = require("fs");
  const cssContent = fs.readFileSync("./public/css/estilos.css", "utf8");
  res.send(cssContent);
});

router.post("/actualizar_css", (req, res) => {
  const datosRecibidos = req.body;
  try {
    const filePath = path.join(__dirname, "public", "css", "estilos.css");
    console.log(filePath);
    fs.writeFileSync(filePath, datosRecibidos, "utf8");
    res.send("CSS obtenido");
  } catch (error) {
    console.log(error);
    res.send("error al actualizar el css" + error);
  }
});

router.get("/get-js", (req, res) => {
  const fs = require("fs");
  const jsContent = fs.readFileSync("./public/js/custom.js", "utf8");
  res.send(jsContent);
});

router.post("/actualizar_js", (req, res) => {
  const datosRecibidos = req.body;
  try {
    const filePath = path.join(__dirname, "public", "js", "custom.js");
    console.log(filePath);
    fs.writeFileSync(filePath, datosRecibidos, "utf8");
    res.send("Js obtenido");
  } catch (error) {
    console.log(error);
    res.send("error al actualizar el js" + error);
  }
});

router.get("/login", (req, res) => {
  res.render("login", { page: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/", async (req, res) => {
  const tabla = "paginas";
  const url = "/";
  db.pagina(tabla, url)
    .then((result) => {
      const contenido = result.rows[0].contenido;
      res.render("index", { page: "Inicio", contenido: contenido });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al recuperar los datos de la base de datos");
    });
});

// router.get("/subida", (req, res) => {  
//   res.render("medios", { page: "Subida de imagenes"});
// });
router.get(
  "/subida",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  },
  (req, res) => {    
    res.render("medios", { page: "Subida de imagenes"});
  }
);

router.get("/contacto", (req, res) => {
  res.send("Contacto", { page: "Contacto" });
});

router.get("/services", (req, res) => {
  const tabla = "paginas";
  const url = "/services";
  db.pagina(tabla, url)
    .then((result) => {
      const contenido = result.rows[0].contenido;
      res.render("index", { page: "Servicios", contenido: contenido });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al recuperar los datos de la base de datos");
    });
});

router.get("/noticias", (req, res) => {
  const tabla = "paginas";
  const url = "/noticias";
  db.pagina(tabla, url)
    .then((result) => {
      const contenido = result.rows[0].contenido;
      res.render("noticias", { page: "Noticias", contenido: contenido });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al recuperar los datos de la base de datos");
    });
});

router.get("/rectorado", (req, res) => {
  const tabla = "paginas";
  const url = "/rectorado";
  db.pagina(tabla, url)
    .then((result) => {
      const contenido = result.rows[0].contenido;
      res.render("rectorado", { page: "Rectorado", contenido: contenido });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al recuperar los datos de la base de datos");
    });
});

router.get("/pregrado", (req, res) => {
  const tabla = "paginas";
  const url = "/pregrado";
  db.pagina(tabla, url)
    .then((result) => {
      const contenido = result.rows[0].contenido;
      res.render("pregrado", { page: "Pregrado", contenido: contenido });
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al recuperar los datos de la base de datos");
    });
});

// router.get("/404", function (req, res, next) {
//   next();
// });

// router.get("/403", function (req, res, next) {
//   var err = new Error("not allowed!");
//   err.status = 403;
//   next(err);
// });

// router.get("/500", function (req, res, next) {
//   next(new Error("keyboard cat!"));
// });

// router.use(function (req, res, next) {
//   res.status(404);

//   res.format({
//     html: function () {      
//       res.render("404", { page: "404", url: req.url })              
//     },
//     json: function () {
//       res.json({ error: "Not found" });
//     },
//     default: function () {
//       res.type("txt").send("Not found");
//     },
//   });
// });

// router.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render("500", { page: "500", error: err });
// });


module.exports = router;
