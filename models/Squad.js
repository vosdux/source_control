const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    stations: [{ type: Types.ObjectId, ref: 'Station'}]
});

module.exports = model('Squad', schema);