const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    fieldName: {type: String, required: true},
    lifeTime: {type: Number, required: true}
});

module.exports = model('Property', schema);
