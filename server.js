var express = require("express");
const url = require('url');
var bodyParser = require("body-parser");
const estudiante = require('./estudiantes');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

//inserción del director
var estudianteUser = {"identificacion": "000000", "name": "Paul", "lastname": "Mccartney", "age": "00", "grade": "00"};
estudiante.count({"identificacion": "000000"}, function (err, count) {
    console.log(count);
    if(count == 0)estudiante.create(estudianteUser);
});

app.get("/", (request, response) => {
    response.send("<html><body><h1>My Server.</h1></body></html>");
});

app.get(BASE_API_PATH+"/healthz", (request, response) => {
    response.sendStatus(200);
});

app.get(BASE_API_PATH+"/estudiantes", (request, response) => {
    console.log(Date() + "GET - /estudiantes");

    const queryObject = url.parse(request.url,true).query;
    //console.log("queryObject");
    //console.log(queryObject);
    //console.log("queryObject.identificacion");
    //console.log(queryObject.identificacion);
    var identificacion = queryObject.identificacion;

    //console.log("request.url");
    //console.log(request.url);
    var filtros = {}
    
    if(typeof queryObject.identificacion !== 'undefined')
    {
        var filtros = {"identificacion": identificacion};
    }    

    estudiante.find(filtros, function(error, resultados) {
        if(error)
        {
            console.log(Date() + " - "+error);
            response.sendStatus(500);
        }
        else
        {
            response.send(resultados.map((estudiante) => {
                return estudiante.cleanup();
            }));
        }
    });
});

//obtener un estudiante por id
app.get(BASE_API_PATH+"/estudiantes/:id", (request, response) => {
    console.log(Date() + "GET - /estudiantes/"+request.params.id);

    estudiante.findById(request.params.id).then((estudiante) => {
        if (!estudiante) {
            return response.status(404).send();
        }
        response.send(estudiante);
    }).catch((error) => {
        response.status(500).send(error);
    });

});

//el body llega vacío con postman pero funciona haciendo el post desde terminal
//curl -i -X POST "http://localhost:3000/api/v1/estudiantes" -H "Content-Type: application/json" -d "{\"identificacion\":\"444444\",\"nombre\":\"Perencejo\",\"editable\":true}"
app.post(BASE_API_PATH+"/estudiantes", (request, response) => {
    console.log(Date() + "POST - /estudiantes");
    var estudiante = request.body;
    console.log("estudiante");
    console.log(estudiante);

    estudiante.count({"identificacion": estudiante.identificacion}, function (err, count) {
        console.log(count);
        if(count > 0)
        {
            //response.sendStatus(500);
            //return response.status(409).send("La identificación ya está registrada.");
            //response.status(409);
            //return response.send("La identificación ya está registrada.");
            //return response.status(409).send('La identificación ya está registrada.');
            response.statusMessage = "La identificación ya está registrada.";
            response.status(409).end();
            return response;
        }
        else
        {
            estudiante.create(estudiante, function(error) {
                if(error)
                {
                    console.log(Date() + " - "+error);
                    response.sendStatus(500);
                }
                else
                {
                    response.sendStatus(201);
                }
            });
        }
    });

});

app.patch(BASE_API_PATH+"/estudiantes/:id", (request, response) => {
    console.log(Date() + "PATCH - /estudiantes");
    var id = request.params.id;
    var datos = request.body;
    console.log("id "+id);
    console.log("datos "+datos);

    estudiante.count({"identificacion": datos.identificacion, _id: { $ne: id }}, function (err, count) {
        console.log(count);
        if(count > 0)
        {
            //return response.status(409).send({message: "No se pudo guardar el cambio. Existe otro estudiante con esa identificación."});
            response.statusMessage = "No se pudo guardar el cambio. Existe otro estudiante con esa identificación.";
            response.status(409).end();
            return response;
        }
        else
        {
            estudiante.findByIdAndUpdate(id, datos, {new: true})
            .then((estudiante) => {
                if (!estudiante) 
                {
                    return response.status(404).send();
                }
                response.send(estudiante);
            })
            .catch((error) => {
                response.status(500).send(error);
            });
        }
    });


});

app.delete(BASE_API_PATH+"/estudiantes/:id", (request, response) => {
    console.log(Date() + "DELETE - /estudiantes");
    // var estudiante_id = request.params.id;
    // console.log("estudiante_id");
    // console.log(estudiante_id);

    estudiante.findByIdAndDelete(request.params.id).then((estudiante) => {
        if (!estudiante) {
            return response.status(404).send();
        }
        response.send(estudiante);
    }).catch((error) => {
        response.status(500).send(error);
    });

});

module.exports = app;