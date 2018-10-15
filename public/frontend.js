// let socket = io.connect();

let isDrawing = false;



document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();

   socket.on('connect', function(){
     console.log("myid: " + socket.id);
   })

   socket.on('drawingSelect',function(status){
     console.log('drawingSelect happened ' + status);
     isDrawing = status; //we can draw now, we're the drawer
      if(isDrawing == true){
        $('.drawingSelectStatus').show();
      }

   })

   $('.textSubmitButton').click(function(){
     let drawingname = $('.textEntry').val(); //give the interior textEntry
     socket.emit('uploadText', drawingname)
     $('.nameDrawing').fadeOut();

   })

   socket.on('drawerTextSelectionDisplay',function(textResponses){

     if(isDrawing == true){
       //show the responses
       isDrawing = false //turns off drawing capability. (this is maybe in the wrong place)
       $('.responses').append('Choose the best drawing name:')
       for(let response in textResponses){
         $('.responses ul').append('<li>' + textResponses[response] + '</li>')
       }
       //click on a response
       $('.responses ul li').click(function(e){
         console.log( this.innerText );
         socket.emit('selectedDrawingName', this.innerText )
         $('.responses').fadeOut();
       })

     }else{
       $('.nameDrawing').fadeOut();
     }
   })

   socket.on('feedbackText',function(){
     //check to see if were not the drawer
     if(isDrawing == false){
       // show text entry
       $('.nameDrawing').show();

     }
   })

   socket.on('finalDrawingName', function(name){
     $('.drawingName').text(name)
     $('.drawingName').fadeIn();
   })


   // $('.clear').click(function(){
   //   console.log('yo?');
   //   socket.emit('clearLineHistory', '')
   //
   // })

   //all of the stuff we need to do on the client side to reset tha game
   socket.on('clearClient',function(){
      context.clearRect(0, 0, canvas.width, canvas.height);
      $('.drawingName').fadeOut(); //stop showing the final drawing name.
      $('.responses').html('<ul></ul>') //clear the responses
      $('.drawingSelectStatus').hide();

   })

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };

   // draw line received from server
	socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
   });

   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
        if(isDrawing == true){
         socket.emit('draw_line', { line: [           mouse.pos, mouse.pos_prev ] });
          mouse.move = false;
          }
        }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});
