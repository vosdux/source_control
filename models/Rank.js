const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    rankId: {type: Number, required: true},
    peoples: [{type: Types.ObjectId, ref: 'People'}],
    norm: {type: Types.ObjectId, ref: 'Norm', required: true}
});

module.exports = model('Rank', schema);
