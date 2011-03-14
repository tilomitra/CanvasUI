  $(document).ready(function() {
    function greyScale(image, bPlaceImage, container){
      console.log(image.src);
      var myCanvas=document.createElement("canvas");
      var myCanvasContext=myCanvas.getContext("2d");

      var imgWidth=image.width;
      var imgHeight=image.height;
      // You'll get some string error if you fail to specify the dimensions
      myCanvas.width= imgWidth;
      myCanvas.height= imgHeight;
      myCanvas.id = "liverCanvas";
      myCanvasContext.drawImage(image,0,0);
      // This function cannot be called if the image is not from the same domain.
      // You'll get security error if you do.
      var imageData = myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
      console.log(imageData);
      
      // This loop gets every pixels on the image and
        for (j=0; j<imageData.height; j++){

          for (i=0; i<imageData.width; i++){
             var index=(i*4)*imageData.width+(j*4);
             var red=imageData.data[index];
             var green=imageData.data[index+1];
             var blue=imageData.data[index+2];
             var alpha=imageData.data[index+3];
             var average=(red+green+blue)/10;
            imageData.data[index]=average;
             imageData.data[index+1]=average;
             imageData.data[index+2]=average;
             imageData.data[index+3]=alpha;
           }
         }
         
      if (bPlaceImage){
        var myDiv=document.createElement("div");
        myDiv.appendChild(myCanvas);
        container.appendChild(myCanvas);
        container.removeChild(image);
      }
      
      return myCanvas.toDataURL();

    }
  
    $('#convert').click(function(e) {
      var self = this;
      e.preventDefault();
      var liverImg = document.getElementById('liverImg');
      var container = document.getElementById('liver');
      var dataUrl = greyScale(liverImg, true, container);
      if (dataUrl) {
        this.text('Converted!');
      }

    });

    $(document).mousemove(function(e) {

      var canvas = document.getElementById('liverCanvas'),
      CANVASTOP = 160;
      CANVASLEFT = 200;
      CANVASWIDTH = canvas.width;
      CANVASHEIGHT = canvas.height;



      //Check to see if the canvas is created.
      //If it is created, then give us the X,Y coordinate relative to the canvas, not the screen
      if (CANVASWIDTH && CANVASHEIGHT &&
        (e.pageX >= CANVASLEFT && e.pageX <= (CANVASLEFT + CANVASWIDTH)) 
          && (e.pageY >= CANVASTOP && e.pageY <= (CANVASHEIGHT + CANVASTOP))) {
            
            var context = canvas.getContext('2d'),
            x = e.pageX-CANVASLEFT,
            y = e.pageY-CANVASTOP,
            data = context.getImageData(x, y, 1, 1).data,
            red = data[0],
            green = data[1],
            blue = data[2],
            alpha = data[3];
            
            console.log(data);
            //subtracting to get the coordinates relative to the canvas, not the page.
            $('#status').html(x + ', ' + y + '<br/> Red: ' + red + ', Green: ' + green + ', Blue: ' + blue + ', Alpha: ' + alpha);

      }

      //if the canvas object isn't created..
      else if (!CANVASWIDTH || !CANVASHEIGHT){
        $('#status').html('Canvas object is not created.');
      }

      //If the mouse is not within the canvas element.
      else {
        $('#status').html('Mouse is outside Canvas element. Bring mouse back inside.');
      }


    });



  });
