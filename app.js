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
var userPool = {};
var userNames = [];
var countUsers = 0;

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
    return true;
});
app.get('/register/:name', function (req, res) {
    var data = req.params.name;
    var acheKi = userNames.indexOf(req.params.name);
    if(acheKi) {
        return 1;
    }
    return 0;
});

//server port bindings
http.listen(8080, function () {
  console.log('NodeApp listening in on 8080 for frontend');
})
http.listen(8443, function () {
  console.log('SSL ported server');
})

//event handling
io.on('connection', function(socket){
    console.log('User Connected #'+(++countUsers));
    socket.on('disconnect', function(){
        console.log('User Disconnected #'+(--countUsers));
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('storeClientInfo', function(data){
        var clientPool = new Object();
        clientPool.customId = data.customId;
        clientPool.clientId = socket.id;
        userPool.push({socket.id : data.customId});
        userNames.push(data.customId);
        console.log('New User Registered :: '+data.customId);
    });
});