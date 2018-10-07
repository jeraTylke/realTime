function setup(){
  createCanvas(400,400)
  background(0)
}
 function draw(){
   // noCursor()
    // fill(0, 12);
   // rect(0, 0, width, height);
   // fill(255);
   // noStroke();
   // ellipse(mouseX, mouseY, 20, 20);


   noCursor()

   }

 function mousePress(){
 if (mouseIsPressed){
   ellipse(mouseX, mouseY, 10, 10)
   fill(255)

 }
}
