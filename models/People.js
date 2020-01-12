const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    secondName: {type: String, required: true}
});

module.exports = model('People', schema);