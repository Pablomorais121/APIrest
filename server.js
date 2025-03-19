const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const sensorRoutes = require('./routes/sensors.routes');
const readingRoutes = require('./routes/readings.routes');

var app = express();
var port = 3000;

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin:['http://localhost:3000', 'http://192.168.1.X']}));
app.use((req,res,next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});
app.disable('x-powered-by');

app.use('/sensors',sensorRoutes);
app.use('/readings', readingRoutes);

app.get('/test', (req ,res) => res.json({msg: 'El API REST funciona!'}));

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));