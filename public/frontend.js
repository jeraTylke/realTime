let socket = io.connect();


socket.on('connect', function(){
  console.log('we connected to the server as:');
  console.log(socket.id);

})
  $('body'). click(function(event){
    console.log('we clicked');
    console.log(event.clientX, event.clientY);

    $('<div>💯</div>').css({
      'position': 'absolute',
      'top': event.clientY,
      'left': event.clientX
    }).appendTo('body')

    //package up the mouse data to send to the server
    let mouseData = {
      'mouseX' : event.clientX,
      'mouseY' : event.clientY
    }

    //send the data up to the server to deal with it!
    socket.emit('addEmoji', mouseData);

  })
  //listen for the send mass emoji message
  socket.on('sendMassEmoji', function(mouseData){
    //do something with the incoming mouseData from everyone else
    $('<div>@</div>').css({
      'position': 'absolute',
      'top': mouseData.mouseY,
      'left': mouseData.mouseX
    }).appendTo('body')

  })
