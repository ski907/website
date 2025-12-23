const canvas = document.getElementById("tempSpark");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "red";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.stroke();
