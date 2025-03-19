const sanitize = require("mongo-sanitize");
const Reading = require("../models/Reading");
const moment = require("moment");

const getReadingsBySensor = async (req, res) => {
    try {
        let query;
        try {
            query = JSON.parse(req.params.sensorId);
        } catch {
            query = { sensorId: req.params.sensorId };
        } 
        var clean = sanitize(query)     
        const readings = await Reading.find(clean);
        if (!readings.length) {
            return res.status(404).json({ msg: 'No se encontraron lecturas para este sensor' });
        }
        res.status(200).json(readings);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener las lecturas', error: err.message});
    }
};

const createReading = async (req, res) => {
    try {
        const { sensorId, value, unit } = req.body;
        if (!sensorId || !value || !unit) {
            return res.status(400).json({ msg: "Faltan datos sensorId, value o unit" });
        }
        const reading = new Reading({
            sensorId,
            value,
            unit,
        });
        
        await reading.save();
        res.status(201).json({ msg: "Lectura guardada correctamente", reading });
    } catch (err) {
        res.status(500).json({ msg: "Error al guardar la lectura", error: err.message });
    }
};

const deleteReadingsBySensor = async (req, res) => {
    try {
        let query;
        try {
            query = JSON.parse(req.params.sensorId);
        } catch {
        query = { sensorId: req.params.sensorId };
        }
        var clean = sanitize(query) 
        const result = await Reading.deleteMany(clean);
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "No se encontraron lecturas para eliminar" });
        }
        res.status(200).json({ msg: "Todas las lecturas del sensor fueron eliminadas"});
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar las lecturas", error: err.message});
    }
};

const getReadingsByTimeRange = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { start, end } = req.query;
        console.log("Start recibido:", start);
        console.log("End recibido:", end);
        if (!start || !end) {
            return res.status(400).json({ msg: "steart y endformato DD-MM-YYYY" });
        }
        const startDate = moment(start, "DD-MM-YYYY").startOf('day').toDate();
        const endDate = moment(end, "DD-MM-YYYY").endOf('day').toDate();
        console.log("Start convertido:", startDate);
        console.log("End convertido:", endDate);
        const filter = {
        sensorId: sensorId, timestamp: { $gte: startDate, $lte: endDate }
        };
        console.log("Filtro aplicado:", filter);
        const readings = await Reading.find(filter);
        if (readings.length === 0) {
            return res.status(404).json({ msg: "No se encontraron lecturas" });
        }
        res.status(200).json(readings);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ msg: "Error ", error: err.message });
    }
};

module.exports = {getReadingsBySensor, createReading, deleteReadingsBySensor, getReadingsByTimeRange};
