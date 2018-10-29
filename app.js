var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(3000);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("The server is running: 3000 ");

// array of all lines drawn
var line_history = [];
let textResponses = []

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });

   socket.on('clearLineHistory',function(){
     console.log('clear message recd');
     //clear the line history, by refreshing the array with noting!
      line_history = []
      io.emit('clearClient', '')
      console.log(line_history);


   })
   //add the text entries to the drawing name array.
   socket.on('uploadText',function(drawingname){
     textResponses.push(drawingname);
   })

   socket.on('selectedDrawingName',function(name){
     io.emit('finalDrawingName', name)
   })
});







gameTiming(); //initialize the gametiming.

function gameTiming(){
  console.log('choose drawing player and spectators')

  io.clients((error,clients)=>{
    console.log(clients);
    let randomSocketID = clients[Math.floor(Math.random()*clients.length)]
    console.log(randomSocketID);
    io.to(randomSocketID).emit('drawingSelect', true)
  })


  setTimeout(function(){
      console.log('drawing done, enable text feedback')
      io.emit('feedbackText', 'hi')

    setTimeout(function(){
        console.log('text feedback done, enable drawer selection')
          io.emit('drawerTextSelectionDisplay', textResponses)
          console.log(textResponses);
          //selection done, answer is chosen.
      setTimeout(function(){
              console.log('selection done, show results')
              //we dont really need to do anything here,but the space might be nice for a buffer or another kind of interaction...
        setTimeout(function(){
            console.log('reset game')
            //reset everyones status
            io.emit('drawingSelect', false) //reset everyone to not drawing
            textResponses = [] //clear the text entries
            io.emit('clearClient', 'clearing client') //clear the drawing
            gameTiming();
        },10000)
      },10000)
    }, 10000)
  }, 10000)
}
