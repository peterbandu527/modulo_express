const express = require("express");
const router = express();
const db = require("./database/db");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const PassportLocal = require("passport-local").Strategy;

router.use(cookieParser("mi secreto"));
router.use(
  session({
    secret: "mi secreto",
    resave: true,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

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

//Serializacion
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Deserializacion
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
    //res.render("dashboard", { page: "Dashboard" });
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
  //res.render("index", { page: "Inicio" });
});

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
  //res.render("services", { page: "Servicios" });
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
  //res.render("noticias", { page: "Noticias" });
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
  //res.render("rectorado", { page: "Rectorado" });
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
  //res.render("pregrado", { page: "Pregrado" });
});

module.exports = router;
