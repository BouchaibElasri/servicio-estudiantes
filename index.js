const { application } = require('express');
var bodyParse = require('body-parser');
var express = require('express');

var port = 3000;
var BASE_API_PATH = "/api/v1";

// Array de estudiantes par GET
var estudiantes = [
    {"name" : "peter", "phone": "12345"},
    {"name" : "john", "phone": "6666"},
]

console.log("starting API server ..");

var app = express();
app.use(bodyParse.json());

// Get Estudiante

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server </h1></body></html>");
});

app.get(BASE_API_PATH + "/estudiantes", (req, res) => {
    console.log(Date() + " - GET /estudiantes");
    res.send(estudiantes);
});

// Post Estudiante

app.post(BASE_API_PATH + "/estudiantes", (req, res) => {
    console.log(Date() + "  - POST /estudiantes");

    // Array de estudiantes par Post
    var estudiante = req.body;
    estudiantes.push(estudiante);
    res.sendStatus(201);
})

app.listen(port);
console.log("sever Ready !"); 