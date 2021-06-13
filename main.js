// -----------------------------------------------------------SLIDE CAROUSEL WITH MOUSE--------------------------  
$('#secondCarousel').bind('mousewheel', function(e) {
  if(e.originalEvent.wheelDelta /120 > 0) {
      $(this).carousel('prev');
  } else {
      $(this).carousel('next');
  }
});
$('#myCarousel').bind('mousewheel', function(e) {
    if(e.originalEvent.wheelDelta /120 > 0) {
        $(this).carousel('prev');
    } else {
        $(this).carousel('next');
    }
  });
// set up text to print, each item in array is new line
var aText = new Array(
  "Hi,", 
  "I'm a DESIGNER and a",
  "FRONTEND DEVELOPER.",
  "Keep scrolling to know ",
  "more about me."
  );
  var iSpeed = 100; // time delay of print out
  var iIndex = 0; // start printing array at this posision
  var iArrLength = aText[0].length; // the length of the text array
  var iScrollAt = 20; // start scrolling up at this many lines
   
  var iTextPos = 0; // initialise text position
  var sContents = ''; // initialise contents variable
  var iRow; // initialise current row
   
  function typewriter()
  {
   sContents =  ' ';
   iRow = Math.max(0, iIndex-iScrollAt);
   var destination = document.getElementById("typedtext");
   
   while ( iRow < iIndex ) {
    sContents += aText[iRow++] + '<br />';
   }
   destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
   if ( iTextPos++ == iArrLength ) {
    iTextPos = 0;
    iIndex++;
    if ( iIndex != aText.length ) {
     iArrLength = aText[iIndex].length;
     setTimeout("typewriter()", 500);
    }
   } else {
    setTimeout("typewriter()", iSpeed);
   }
  }
  
  
  typewriter();

// ------------------------------------------------------------HELIX JS-------------------------------------------------

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Initialise
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.scale(2, 2);
var onMobile = false;

var w = window.innerWidth,
    h = window.innerHeight;
canvas.width = w;

if (h >= 800)
    canvas.height = h;
else
    canvas.height = 600;

//variables for animation

//number of particles
var particleNum;
var particles = [];
particleAmount();


var minDist = w / 7;
if (minDist < 200) {
    minDist = 210;
} else if (minDist > 300) {
    minDist = 300;
}

var dist;
var mx, my;
var mouseDown = false;
var nodecount = 0;

function particleAmount() {
    particleNum = (w / 50);
    if (particleNum < 20) particleNum = 20;
    particles = [];
    //create and store particles in array
    for (var i = 0; i < particleNum; i++) {
        particles.push(new Particle());
        particles[i].x = (i * (w / particleNum));
    }
}


//get mouse position
canvas.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(canvas, evt);
}, false);

function getMousePos(canvas, evt) {
    mx = evt.clientX;
    my = evt.clientY;
}

//paint background
function paintCanvas() {
    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, w, h);
}

//particle class
function Particle() {
    this.y = Math.random() * h;
    this.vy = (Math.random() * -1) / 3;

    //size of Particle
    this.radius = 1.5;

    //draw particle
    this.draw = function() {
        var dist = Math.abs(this.y - h / 2);

        ctx.fillStyle = "rgba(38,38,38,38)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }

    this.drawMobile = function() {
        var dist = Math.abs(this.y - h / 2);

        ctx.fillStyle = "rgba(38,38,38, " + (0 + dist / minDist) / 1.1 + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(38,38,38," + (1 - dist / minDist) / 2 + ")";
        ctx.moveTo(p.x, 0);
        ctx.lineTo(p.x, h);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(38,38,38," + (1 - dist / minDist) / 2 + ")";
        ctx.moveTo(0, p.y);
        ctx.lineTo(w, p.y);
        ctx.stroke();
        ctx.closePath();
    }
}

function draw() {
    paintCanvas();
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        if (!onMobile) {
            p.draw();
        } else {
            p.drawMobile();
        }
    }
    update();
}

var amplitude = h / 200;
var period = 100.0;
var theta = 0.0;
var dx = ((Math.PI * 2) / particleNum);

//particles motion
function update() {
    if (!onMobile) {
        theta += 0.0025;
        var x = theta;

        //amplitude calculation
        if (onMobile) {
            amplitude = w / 10;
        } else {
            if (amplitude < 300) {
                amplitude = w / 10;
            } else {
                amplitude = 300;
            }
        }

        for (var i = 0; i < particles.length; i++) {
            p = particles[i];
            if (i % 2 == 0)
                p.y = (Math.sin(x) * amplitude) + h / 2;
            else
                p.y = (1 - Math.sin(x) * amplitude) + h / 2;

            x += dx;

            //make sure the particles don't escape
            if (p.x + p.radius > w) {
                p.x = p.radius;
            } else if (p.x - p.radius < 0) {
                p.x = w - p.radius;
            }

            if (p.y + p.radius > h) {
                p.y = p.radius;
            } else if (p.y - p.radius < 0) {
                p.y = h - p.radius;
            }

            //check distance from current particle to all others
            for (var j = i + 1; j < particles.length; j++) {
                var p2 = particles[j];
                distance(p, p2);
            }

            if (mouseDown) {
                mouseRepel(p, mx, my);
            } else {
                mouseAttract(p, mx, my);
            }

        }
    } else {
        for (var i = 0; i < particles.length; i++) {
            p = particles[i];
            p.y += p.vy;

            //make sure the particles don't escape
            if (p.x + p.radius > w) {
                p.x = p.radius;
            } else if (p.x - p.radius < 0) {
                p.x = w - p.radius;
            }

            if (p.y + p.radius > h) {
                p.y = p.radius;
            } else if (p.y - p.radius < 0) {
                p.y = h - p.radius;
            }


            if (mouseDown) {
                mouseRepel(p, mx, my);
            }
        }
    }
}

//distance between particles
function distance(p1, p2) {
    var dist;
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;

    dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= minDist) {

        ctx.beginPath();
        ctx.strokeStyle = "rgba(28,28,28,0.8)";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
    }
}

//reposition particles on window size change
function repositionParticles() {
    particleAmount();
    for (var i = 0; i < particles.length; i++) {
        particles[i].x = (i * (w / particleNum));
    }
    minDist = w / 6;
    if (minDist < 210) {
        minDist = 210;
    } else if (minDist > 300) {
        minDist = 300;
    }

    if (amplitude < 300) {
        amplitude = w / 10;
    } else {
        amplitude = 300;
    }

    dx = ((Math.PI * 2) / particleNum);
}

function mouseAttract(p, mousex, mousey) {
    var dist;
    var dx = p.x - mousex;
    var dy = p.y - mousey;
    var mass = 12;
    dist = Math.sqrt(dx * dx + dy * dy);

    if (amplitude > 150) amplitude -= 0.07 - (1 / (amplitude - 150));

    if (dist <= minDist) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(70,70,70," + (1.2 - dist / minDist) + ")";
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mousex, mousey);
        ctx.stroke();
        ctx.closePath();

        if (p.radius < 5) {
            p.radius += 0.1;
        }
    } else {
        p.radius -= 0.05 * 1.5;
        if (p.radius <= 1.5) {
            p.radius = 1.5;
        }
    }
}

function mouseRepel(p, mousex, mousey) {
    var dist;
    var dx = p.x - mousex;
    var dy = p.y - mousey;
    theta += 0.0003;

    dist = Math.sqrt(dx * dx + dy * dy);

    if (amplitude < 300)
        amplitude += 0.1;
    else if (amplitude >= 300)
        amplitude = 300;

    if (dist <= minDist) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(70,70,70,0.6)";
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mousex, mousey);
        ctx.stroke();
        ctx.closePath();
    }
}

canvas.onmousedown = function(evt) {
    mouseDown = true;
}
canvas.onmouseup = function(evt) {
    mouseDown = false;
}

//begin the animation loop
function animLoop() {
    draw();
    requestAnimFrame(animLoop);
}

animLoop();

window.onresize = function() {
        canvas.width = window.innerWidth;
        w = window.innerWidth;
        h = window.innerHeight;
        paintCanvas();
        repositionParticles();
    }


function phoneFunction() {
    var copyText = document.getElementById("phone");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }
  function mailFunction() {
    var copyText = document.getElementById("mail");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }
  function whatsappFunction() {
    var copyText = document.getElementById("whatsapp");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }        
  function instaFunction() {
    var copyText = document.getElementById("instagram");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }  