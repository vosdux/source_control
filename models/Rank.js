const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    peoples: [{type: Types.ObjectId, ref: 'People'}],
    properties: [{type: String}]
});

module.exports = model('Rank', schema);
