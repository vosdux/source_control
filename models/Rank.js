const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    peoples: [{type: Types.ObjectId, ref: 'People'}],
    properties: [{
        name: {type: String, required: true},
        fieldName: {type: String, required: true}
    }]
});

module.exports = model('Rank', schema);
