const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    secondName: {type: String, required: true},
    midleName: {type: String},
    position: {type: String, required: true},
    idcard: {type: String, required: true},
    rank: {type: Types.ObjectId, ref: 'Rank', required: true},
    station: {type: Types.ObjectId, ref: 'Station', required: true},
    upload: {type: String, required: false},
    propertyes: [{
        property: {type: Types.ObjectId, ref: 'Property', required: true},
        date: {type: Date, required: true, default: Date.now},
        discarded: {type: Boolean, default: false},
        __v: false
    }]
});

schema.index({secondName: 'text'});

module.exports = model('People', schema);
