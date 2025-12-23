const canvas = document.getElementById("tempSpark");
const ctx = canvas.getContext("2d");

canvas.width = 220;
canvas.height = 40;

// draw a test line
ctx.strokeStyle = "red";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(0, 20);
ctx.lineTo(220, 20);
ctx.stroke();
