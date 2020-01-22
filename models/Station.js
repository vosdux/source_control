const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    place: {type: String, required: true},
    squad: {type: Types.ObjectId, ref: 'Squad', required: true},
    peoples: [{type: Types.ObjectId, ref: 'People'}]
});

module.exports = model('Station', schema);
