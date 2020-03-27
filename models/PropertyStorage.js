const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    property: { type: Types.ObjectId, ref: 'Property', required: true },
    data: [
        {
            _id: false,
            size: { type: String, required: true },
            count: { type: Number, required: true }
        }
    ]
});

module.exports = model('PropertyStorage', schema);
