const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    properties: [{type: Types.ObjectId, ref: 'Property', required: true}],
    owners: [{type: Types.ObjectId, ref: 'Rank', required: true}]
});

module.exports = model('Norm', schema);
