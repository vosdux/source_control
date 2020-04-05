const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    properties: [{
        property: { type: Types.ObjectId, ref: 'Property', required: true },
        count: { type: String, required: true }
    }],
    owners: [{ type: Types.ObjectId, ref: 'Rank', required: true }],
    sex: { type: String, required: true }
});

module.exports = model('Norm', schema);
