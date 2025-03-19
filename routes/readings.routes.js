const express = require('express');
const { getReadingsBySensor, createReading, deleteReadingsBySensor, getReadingsByTimeRange } = require('../controllers/readings.controller');
const authMiddleware = require('../middlewares/auth.Middleware');

const router = express.Router();

router.get('/:sensorId', getReadingsBySensor);
router.post('/', authMiddleware, createReading);
router.delete('/:sensorId', authMiddleware, deleteReadingsBySensor);
router.get('/time/:sensorId', authMiddleware, getReadingsByTimeRange);

module.exports = router; 
