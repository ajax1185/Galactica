import express from "express";
import axios from "axios";
import { config } from "node:process";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";
const API_URL_COCKTAIL = "www.thecocktaildb.com/api/json/v1/1/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extends: true }));

const db = new pg.Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "estudio",
});

db.connect();

let mensaje = "";

app.get("/Batalla", (req, res) => {
  res.render("batalla.ejs");
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
    mensaje = (await consultas("usuario", req, res)) === "1" ? "1" : "0";
    res.render("login.ejs", {
      error: mensaje,
    });
  }
});

async function consultas(tipo, req, res) {
  switch (tipo) {
    case "usuario":
      const querySelect =
        "SELECT username, password FROM USUARIOS WHERE USERNAME = $1 AND PASSWORD = $2";
      const user = req.body.user;
      const pass = req.body.pass;
      const queryResult = await db.query(querySelect, [user, pass]);
      const queryRows = queryResult.rows.length > 0 ? "1" : "0";
      return queryRows;
      break;
    case "insertar":
      try {
        const queryInsert =
          "INSERT INTO USUARIOS (USERNAME, PASSWORD) VALUES ($1, $2)";
        const username = req.body.user;
        const password = req.body.pass;
        await db.query(queryInsert, [username, password]);
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
