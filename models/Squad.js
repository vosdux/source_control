const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    garisons: [{ type: Types.ObjectId, ref: 'Station'}]
});

module.exports = model('Squad', schema);