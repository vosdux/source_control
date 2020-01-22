const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    secondName: {type: String, required: true},
    midleName: {type: String},
    position: {type: String, required: true},
    rank: {type: String, required: true},
    station: {type: Types.ObjectId, ref: 'Station', required: true},
    photo: {type: String, required: true}
});

module.exports = model('People', schema);
