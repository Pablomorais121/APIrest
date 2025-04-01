const aedes = require('aedes')();
const net = require('net');
const http = require('http');
const WebSocket = require('ws');

const mqttPort = 1883;
const wsPort = 8888;

const MqttServer = net.createServer(aedes.handle);
const httpServer = http.createServer();

const WsServer = new WebSocket.Server({ server: httpServer});

WsServer.on('conection', (ws) => {
    const stream = WebSocket.createWebSocketStream(ws);
    aedes.handle(stream);
});

aedes.on('publish', function(packet, client){
    if(client){
        console.log(' - Message Published: ', packet.topic);
    }
});

aedes.on('ClientDisconnect', function(client){
    console.log(' - ClientDisconnected: ', client.id);
});

aedes.on('client', function(client){
    console.log(' - New Client: ', client.id);
});

aedes.on('subscribe', function(subscriptions, client){
    console.log(' - Client Suscribed: ', subscriptions);
});

const startBroker = function(){
    MqttServer.listen(mqttPort, function(){
        console.log('Servidor MQTT en el puerto: ', mqttPort);
    });
    httpServer.listen(wsPort, () => {
        console.log('Servidor Websocket en el puerto: ', wsPort);
    });
};

const publish = function(topic, message){
    aedes.publish({topic: topic, payload: message});
};

const subscribe = function(topic){
    aedes.subscribe(topic, function(){
        console.log(' - Client subscribed to: ', topic);
    });
};

module.exports = {startBroker, publish, subscribe};