const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    secondName: {type: String, required: true},
    midleName: {type: String},
    position: {type: String, required: true},
    rank: {type: Types.ObjectId, ref: 'Rank', required: true},
    station: {type: Types.ObjectId, ref: 'Station', required: true},
    upload: {type: String, required: false},
    property: [{type: Types.ObjectId, ref: 'Property'}]
});

module.exports = model('People', schema);
