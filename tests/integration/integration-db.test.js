const estudiante = require('../../estudiantes');
const mongoose = require('mongoose');
const dbConnect = require('../../db');

describe('estudiantes DB connection', () => {
    beforeAll(() => {
        return dbConnect();
    })

    beforeEach((done) => {
        estudiante.deleteMany({}, (err) => {
            done();
        });
    });

    it('writes a contact in the DB', (done) => {
        const estudiante = new estudiante({name: 'pepe', phone: '666'});
        estudiante.save((err, estudiante) => {
            expect(err).toBeNull();
            estudiante.find({}, (err, estudiantes) => {
                expect(estudiantes).toBeArrayOfSize(1);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

})