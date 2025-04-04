const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const sensorRoutes = require('./routes/sensors.routes');
const readingRoutes = require('./routes/readings.routes');
const authRoutes = require('./routes/auth.routes'); 

const mqttBroker = require('./services/broker');
mqttBroker. startBroker();

var fs = require('fs');
var https = require('https');

var app = express();
var port = 443 || process.env.PORT;

connectDB();

//Configuracion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin:['http://localhost:3000', 'http://192.168.1.X']}));
app.use((req, res,next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});
app.disable('x-powered-by');

app.use('/sensors',sensorRoutes);
app.use('/readings', readingRoutes);
app.use('/auth', authRoutes);

app.get('/test', (req ,res) => res.json({msg: 'El API REST funciona!'}));

var options={
    key: fs.readFileSync(__dirname + '/SSL/apirest.key'),
    cert: fs.readFileSync(__dirname + '/SSL/apirestFirmado.crt'),
    passphrase: 'ejemplo'
};

https.createServer(options, app).listen(port, function(){
    console.log('servidor node.js funcionando en el puerto: ' + port);
});
