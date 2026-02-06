import express from "express";
import axios from "axios";
import { config } from "node:process";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";
const API_URL_COCKTAIL = "www.thecocktaildb.com/api/json/v1/1/";

app.use(express.static("public"));

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
  res.render("login.ejs");
});

app.listen(port, () => {
  console.log(`El puerto por el cual se esta conectando es el ${port}`);
});
