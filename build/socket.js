module.exports = {
  launchSocket: function(http){
    var io = require('socket.io')(http);
    var users = {};
    io.on('connection', function(socket){
      var name = "";
      socket.on('log', function(id){
        if(!(id in users)){
          console.log(id + ' connected');
          name = id;
          socket.emit('logged', 
            {id: socket.id, 
              users: Object.keys(users)
            });
          users[id] = socket.id;
          socket.broadcast.emit('newUser', id);
        }else{
          socket.emit('badName');
        }
      });
      socket.on('unlog', function(){
        if(users[name]){
          console.log(name + ' disconnected');
          socket.broadcast.emit('userQuit', name)
          delete users[name];
        }
      });
      socket.on('disconnect', function(){
        if(users[name]){
          console.log(name + ' disconnected');
          socket.broadcast.emit('userQuit', name)
          delete users[name];
        }
      });

      socket.on('sendMessage', function(msg){
        if(msg.from in users){
          io.sockets.connected[users[msg.to]].emit('newMessage', msg);
        }
      });
    });
  }
}