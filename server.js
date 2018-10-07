let express = require('express'); // lets our app require the use of express
let app = express(); // start up express;
let server = require('http').Server(app) //start a server using our app
let io = require('socket.io')(server)
let port = 3000; // set a port for access

app.use(express.static('public')); // have our app use the folder public to serve out static files.

io.on('connection', function(socket){
  //what should we do when someone connects?
  console.log(socket.id);

  //listen for the addEmoji message which contains the mouse data
  socket.on('addEmoji', function(mouseData){
    //do something with our mouse data

    //this is an information relay. Get in the data from one client, and then use the server to send it out to all clients. (in a sense 'copying the data to everyone')

    //send the mouse data that we recieved out to all connected clients.

    io.emit('sendMassEmoji', mouseData)


  })

})





server.listen(port, function(){  // start the server listening on the port that we've assigned.

  console.log('server started on:' + port);

})
