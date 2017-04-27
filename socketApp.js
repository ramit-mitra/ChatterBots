var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const pug = require('pug');
var path = require('path');
var countUsers = 0;
app.get('/', function(req, res){
  //res.send(pug.renderFile('socketApp.html'));
  res.sendFile(path.join(__dirname+'/socketApp.html'));
});

io.on('connection', function(socket){
    console.log('User Connected #'+(++countUsers));
    socket.on('disconnect', function(){
        console.log('User Disconnected #'+(--countUsers));
    });
    socket.on('chat message', function(from, msg){
        io.emit('chat message', msg);
    });
});


http.listen(3000, function(){
  console.log('Hosting at *:3000');
  console.log('[Ramit]Mitra');
});