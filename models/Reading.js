const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
    
    sensorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    },
    value: Number,
    unit: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reading', ReadingSchema);