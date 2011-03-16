  $(document).ready(function() {

    //GLOBALS
    var CANVASTOP = 160,
    CANVASLEFT = 200,
    CIRCLE = $('<div class="circle"></div>'),
    CLICK_X=0,
    CLICK_Y=0;



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
      var self = $(this);
      e.preventDefault();
      var liverImg = document.getElementById('liverImg');
      var container = document.getElementById('liver');
      var dataUrl = greyScale(liverImg, true, container);
      if (dataUrl) {
        $(this).val('Converted');
        $(this).attr('disabled', 'true');
      }

    });

    $(document).mousemove(function(e) {

      var canvas = document.getElementById('liverCanvas'),
      CANVASWIDTH = (canvas) ? canvas.width : undefined;
      CANVASHEIGHT = (canvas) ? canvas.height : undefined;



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
            
            //console.log(data);
            //subtracting to get the coordinates relative to the canvas, not the page.
            $('#status').html('X: ' + x + ', Y: ' + y + '<br/> Red: ' + red + ', Green: ' + green + ', Blue: ' + blue + ', Alpha: ' + alpha);

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

    $("#liver").mousehold(50, function(i){  
      console.log(i);
      var newCircle = $('<div class="circle"></div>'),
      context = document.getElementById('liverCanvas').getContext('2d'),
      data = context.getImageData(CLICK_X - CANVASLEFT, CLICK_Y - CANVASTOP, 1, 1).data,
      bg = '#'+RGBtoHex(data[0],data[1], data[2]);
      

      if (i < 25) {
        var styles = {
          //'background':              '-webkit-gradient(radial, 206 -88, 0, 0 -29, 412, from(#FCFCFC), to(#000), color-stop(.7,'+bg+'))',
          'background':             'transparent url("incision2.png") no-repeat',
          '-webkit-border-radius':  '50px',
          'width':                  50 + 3*i + 'px',
          'height':                 50 + 3*i + 'px',
          'z-index':                "30",
          'opacity':                0.2+0.1*i+'',
          'position':               "absolute",
          'top':                    CLICK_Y - (50 + 3*1),
          'left':                   CLICK_X - (50 + 3*1)
        };

        newCircle.css(styles);
        $('div#liver .circle').remove();
        $('div#liver').append(newCircle);
      }

    });

    $('#liver').mousedown(function(e) {
      CLICK_X = e.pageX;
      CLICK_Y = e.pageY;
    });


    $("#liver").mouseup(function() {
      //$('div#liver').append(CIRCLE);
      $(CIRCLE).animate({
        opacity: 0.8,
      }, 200);
      console.log(CIRCLE);

      slowlyRemoveCircles();
    });

    function slowlyRemoveCircles() {
    $('.circle').each(function(index) {
      var self = $(this),
      oldOpacity = self.css('opacity');
      if (oldOpacity > 0.10) {

        self.animate({
          opacity: 0.4 //some random opacity between 0 and 0.5
        }, 10000);
      }

      //remove it from the circle class so it doesn't disappear when a new circle is drawn.
      self.removeClass('circle').addClass('oldCircle');
    });
  }

  function RGBtoHex(R,G,B) {
    return toHex(R)+toHex(G)+toHex(B)
  }
  
  function toHex(N) {
    if (N==null) return "00";
    N=parseInt(N); 
    if (N==0 || isNaN(N)) return "00";
    N=Math.max(0,N); 
    N=Math.min(N,255); 
    N=Math.round(N);
    return "0123456789ABCDEF".charAt((N-N%16)/16)
      + "0123456789ABCDEF".charAt(N%16);
  }

});
