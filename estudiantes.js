const mongoose = require('mongoose');

const estudiantetSchema = new mongoose.Schema({
    identificacion: {
        type: String, 
        required: true
    },
    
    name: {
        type: String, 
        required: true
    }, 
    lastname: {
        type: String, 
        required: true
    },
    age: {
        type: Number, 
        required: true
    },
    grade: {
        type: String,
        required: true
    }
});

estudiantetSchema.methods.cleanup = function() {
    return {_id: this._id, name: this.name,lastname: this.lastname,age: this.age,grade: this.grade};
}

const estudiante = mongoose.model('estudiante', estudiantetSchema);

module.exports = estudiante;



