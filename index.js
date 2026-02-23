import express from "express";
import axios from "axios";
import { config } from "node:process";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";
const API_URL_COCKTAIL = "www.thecocktaildb.com/api/json/v1/1/";
const saltRounds = 10;
let resultado = false;
let arreglo = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extends: true }));
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "estudio",
});

db.connect();

let mensaje = "";
let resultadoMensajeArray = [];
let informacion = [];

app.get("/Batalla", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("batalla.ejs");
  } else {
    res.redirect("/");
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

app.get("/CocktailAPI", async (req, res) => {
  try {
    const response = await axios.get(API_URL_COCKTAIL + "list.php?i=list");
    console.log(JSON.stringify(response.data));
    res.render("cocktailApi.ejs", {
      ingredient: JSON.stringify(response),
    });
  } catch (error) {
    res.render("cocktailApi.ejs", { error: error.message });
  }
});

app.get("/Inicio", (req, res) => {
  res.render("login.ejs");
});

app.get("/", (req, res) => {
  // console.log(consultas("usuario", req));

  res.render("login.ejs");
});

app.post("/add", async (req, res) => {
  const registro = req.body["registro"];
  const ingreso = req.body["ingreso"];
  const cancelar = req.body["cancelar"];
  const registroPrimeraVez = req.body["registrarsePrimeraVez"];
  const user = req.body.user;
  const pass = req.body.pass;
  if (registro != null) {
    // mensaje = "El usuario fue ingresado con exito";
    res.render("login.ejs", { registro: 1 });
  }

  if (cancelar != null) {
    // mensaje = "El usuario fue ingresado con exito";
    res.render("login.ejs", { registro: 0 });
  }

  if (registroPrimeraVez != null) {
    mensaje = await consultas("insertar", req, res);
    res.render("login.ejs", {
      registroPV: mensaje,
    });
  }

  if (ingreso != null) {
    const querySelect =
      "SELECT id, username, password FROM USUARIOS WHERE USERNAME = $1";
    const user = req.body.user;
    const pass = req.body.pass;
    const queryResult = await db.query(querySelect, [user]);

    if (queryResult.rows.length > 0) {
      bcrypt.compare(pass, queryResult.rows[0].password, (err, result) => {
        if (err) {
          console.log("Error al comparar las contraseñas");
        } else {
          if (result) {
            res.render("login.ejs", { error: "1" });
          } else {
            console.log("Contraseña incorrecta");
          }
        }
      });
    } else {
      res.send("No existe el usuario");
    }
  }
});

async function consultas(tipo, req, res) {
  switch (tipo) {
    case "insertar":
      try {
        const queryInsert =
          "INSERT INTO USUARIOS (USERNAME, PASSWORD) VALUES ($1, $2)";
        const username = req.body.user;
        const password = req.body.pass;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          await db.query(queryInsert, [username, hash]);
        });
        return 1;
      } catch (error) {
        console.error("El usuario ya existe en la bdd");
        return 2;
      }
      break;

    default:
      "No hubo resultados";
      break;
  }
}

app.listen(port, () => {
  console.log(`El puerto por el cual se esta conectando es el ${port}`);
});
