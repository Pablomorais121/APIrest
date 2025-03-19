const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
    name: String,
    type: String,
    location: String,
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Sensor', SensorSchema);