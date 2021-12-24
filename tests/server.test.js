const app = require('../server.js');
const estudiante = require('../estudiantes.js');
const request = require('supertest');

describe("Hello world tests", () => {

    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });

});

describe("estudiantes API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });

    describe("GET /estudiantes", () => {

        beforeAll(() => {            
            const estudiantes = [
                new estudiante({"name": "juan", "phone": "5555"}),
                new estudiante({"name": "pepe", "phone": "6666"})
            ];

            dbFind = jest.spyOn(estudiante, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, estudiantes);
            });
        });

        it('Should return all estudiantes', () => {
            return request(app).get('/api/v1/estudiantes').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });

    describe('POST /estudiantes', () => {
        const estudiante = {name: "juan", phone: "6766"};
        let dbInsert;

        beforeEach(() => {
            dbInsert = jest.spyOn(estudiante, "create");
        });

        it('Should add a new estudiante if everything is fine', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false);
            });

            return request(app).post('/api/v1/estudiantes').send(estudiante).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(estudiante, expect.any(Function));
            });
        });

        it('Should return 500 if there is a problem with the DB', () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post('/api/v1/estudiantes').send(estudiante).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });
});