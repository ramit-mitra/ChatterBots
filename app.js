var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//connect middleware
app.use(bodyParser.json());

var http = require('http').Server(app);
var path = require('path');
const pug = require('pug');
//loading socket
var io = require('socket.io')(http);
//user pool
var userPool = [];
var userNames = [];
var countUsers = 0;
//the cool params that make magic happen
var inUseTokens = [];
var chatHubs = [];


//create a server
/* http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8080, "127.0.0.1"); */

//routing
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
    return true;
});
app.get('/chatbot', function (req, res) {
    res.send(pug.renderFile('chatbot.pug'));
    //res.sendFile(path.join(__dirname+'/chatbot.html'));
    return true;
});
app.get('/register/:name', function (req, res) {
    var data = req.params.name;
    var acheKi = userNames.indexOf(req.params.name);
    if(acheKi) {
        //userNames.push(req.params.name);
        res.status(200).json(1);
    }
    else {
        res.status(200).json(0);
    }
});
app.get('/get-active-users', function (req, res) {
    res.status(200).json(userNames);
});
app.get('/handshake/:from/:to', function (req, res) {
    //gotta make a new connection between the users 
    //1. get handshaking token 
    var thisToken = getToken();
    //2. make a new connection
    chatHubs.push(newConnection(thisToken));
    console.log('Updated Connections :: '+chatHubs);
    //return the handshaked token
    res.status(200).json(thisToken);
});

//server port bindings
http.listen(8080, function () {
  console.log('NodeApp executing via PORT 8080.');
})
/* http.listen(8443, function () {
  console.log('SSL ported server');
}) */

//event handling
io.on('connection', function(socket){
    console.log('User Connected #'+(++countUsers));
    socket.on('disconnect', function(data){
        console.log('User Disconnected #'+(--countUsers), socket.id);
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('storeClientInfo', function(data){
        var clientPool = new Object();
        clientPool.customId = data.customId;
        clientPool.clientId = socket.id;
        userPool.push([data.customId, socket.id]);
        userNames.push(data.customId);
        console.log('New User Registered :: '+data.customId, 'All Users :: '+userNames, 'User Pool :: '+userPool);
    });
});


function newConnection(token) {
    socket.on(token, function(msg){
        io.emit(token, msg);
    });
}

function getToken(length = 23) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) 
        result += chars[Math.floor(Math.random() * chars.length)];
    //test uniqueness
    var acheKi = inUseTokens.indexOf(result);
    if(acheKi != -1) {
        result = getToken();
    }
    else{
        inUseTokens.push(result);
    }
    return result;
}