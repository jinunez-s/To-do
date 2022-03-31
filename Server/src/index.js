const Express = require("express"); // Importar en nodejs
const { urlencoded } = require('express');
const RequestHandler = require("./handlers/todos");
const { initializeDB } = require("./lib/db");
const cors = require('cors');
require('dotenv').config();

const App = Express();
App.use(cors());
App.use(Express.json());
App.use(urlencoded( { extended: false}))

const PORT = process.env.PORT || 3001;

App.use(RequestHandler)

App.listen(PORT, () =>{
    console.log("I'm Ready :)");
    initializeDB().then(() => console.log("DB READY :)"));
    const url = `http://localhost:${PORT}/`
    console.log(`Listening on ${url}`);
}); //Atento a peticiones