import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";
const API_URL_COCKTAIL = "www.thecocktaildb.com/api/json/v1/1/";
const saltRounds = 10;
let resultado = false;
let arreglo = [];
env.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extends: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.SESSION_USER_PG,
  password: process.env.SESSION_PASSWORD_PG,
  host: process.env.SESSION_HOST_PG,
  port: process.env.SESSION_PORT_PG,
  database: process.env.SESSION_DATABASE_PG,
});

db.connect();

let mensaje = "";
let resultadoMensajeArray = [];
let informacion = [];

app.get("/Inicio", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("portal.ejs");
  } else {
    res.render("login.ejs", { error: "Usuario o contraseña incorrecto" });
  }
});

app.get("/JokerAPI", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "Christmas", config);
    // const result = JSON.stringify(response.data.setup);
    // console.log(result);
    res.render("jokeApi.ejs", {
      randomJoke: JSON.stringify(response.data.setup),
      delivery: JSON.stringify(response.data.delivery),
    });
  } catch (error) {
    res.render("jokeApi.ejs", { error: error.message });
  }
});

// app.get("/CocktailAPI", async (req, res) => {
//   try {
//     const response = await axios.get(API_URL_COCKTAIL + "list.php?i=list");
//     console.log(JSON.stringify(response.data));
//     res.render("cocktailApi.ejs", {
//       ingredient: JSON.stringify(response),
//     });
//   } catch (error) {
//     res.render("cocktailApi.ejs", { error: error.message });
//   }
// });

app.get("/Portal", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("portal.ejs");
  } else {
    res.render("login.ejs", { error: "Usuario o contraseña incorrecto" });
  }
});

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/add",
  passport.authenticate("local", {
    successRedirect: "/Portal",
    failureRedirect: "/Inicio",
  }),
);

passport.use(
  new Strategy(async function verify(username, password, cb) {
    // console.log(username);

    try {
      const resultado = await db.query(
        "SELECT * FROM USUARIOS WHERE USERNAME = $1",
        [username],
      );
      if (resultado.rows.length > 0) {
        const user = resultado.rows[0];
        const storedPassword = user.password;

        bcrypt.compare(password, storedPassword, (err, result) => {
          if (err) {
            return cb(err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("El usuario no existe en la base de datos");
      }
    } catch (error) {
      console.log("El usuario no existe", error);
    }
  }),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`El puerto por el cual se esta conectando es el ${port}`);
});
