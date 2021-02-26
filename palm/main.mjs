const preview = document.querySelector("#preview");
const test = document.querySelector("#test");
const canvas = preview.querySelector("canvas");
const clear = document.querySelector("#clear");
const flip = document.querySelector("#flip");

const ctx = canvas.getContext("2d");

const cr = preview.getBoundingClientRect();
canvas.style.width = `${cr.width}px`;
canvas.style.height = `${cr.height}px`;
canvas.width = cr.width * devicePixelRatio;
canvas.height = cr.height * devicePixelRatio;

ctx.scale(devicePixelRatio, devicePixelRatio);

clear.addEventListener("click", function() {
    ctx.clearRect(0,0,cr.width,cr.height);
});
flip.addEventListener("click", function() {
    document.body.classList.toggle("flipped");
});

function drawLine(a, b) {
    const cr = test.getBoundingClientRect();
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.moveTo(a.clientX-cr.left, a.clientY-cr.top);
    ctx.lineTo(b.clientX-cr.left, b.clientY-cr.top);
    ctx.stroke();
}
function drawTouch(color, width, e) {
    const cr = test.getBoundingClientRect();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.ellipse(e.clientX - cr.left,e.clientY-cr.top,e.width,e.height,0,0,Math.PI*2);
    ctx.stroke();
}

const pointers = {};

test.addEventListener("pointerdown", function(e) {
  e.preventDefault();
  if(e.pointerType === "touch" || e.pointerType === "pen") {
    pointers[e.pointerId] = e;
    drawTouch("rgba(0,200,100,1)", 3, e);
  }
});

test.addEventListener("pointermove", function(e) {
  if(e.pointerId in pointers) {
    drawLine(pointers[e.pointerId], e);
    drawTouch("rgba(255,0,0,1)", 1, e);
    pointers[e.pointerId] = e;
  }
});

test.addEventListener("pointerup", function(e) {
  if(e.pointerId in pointers) {
    drawLine(pointers[e.pointerId], e);
    drawTouch("rgba(100,100,255,1)", 3, e);
    delete pointers[e.pointerId];
  }
});

test.addEventListener("pointercancel", function(e) {
  if(e.pointerId in pointers) {
    drawLine(pointers[e.pointerId], e);
    drawTouch("rgba(0,0,0,1)", 3, e);
    delete pointers[e.pointerId];
  }
});

test.addEventListener("contextmenu", e => e.preventDefault());

// Prevent double-tap handler in Safari :-/
test.addEventListener("touchstart", e => e.preventDefault());