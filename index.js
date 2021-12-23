const { application } = require('express');
var bodyParse = require('body-parser');
var express = require('express');
var DataStore = require('nedb');

var port = 3000;
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + "/estudiantes.json";

// Array de estudiantes par GET


console.log("starting API server ..");

var app = express();
app.use(bodyParse.json());

// base de datos  Estudiante
var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true
});

// Get Estudiante

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server </h1></body></html>");
});

app.get("/api/v1/healthz", (req, res) => {
    res.sendStatus(200);
});

app.get(BASE_API_PATH + "/estudiantes", (req, res) => {
    console.log(Date() + " - GET /estudiantes");

    db.find({}, (err, estudiantes) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.send(estudiantes.map((estudiante) => {
                delete estudiante._id;
                return estudiante;
            }));
        }
    });

});

// Post Estudiante


app.post(BASE_API_PATH + "/estudiantes", (req, res) => {
    console.log(Date() + " - POST /estudiantes");
    // Array de estudiantes par Post
    var estudiante = req.body;
    db.insert(estudiante, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});



app.listen(port);
console.log("sever Ready !"); 