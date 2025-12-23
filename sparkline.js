const canvas = document.getElementById("tempSpark");
const ctx = canvas.getContext("2d");

const url = "https://api.weather.gov/gridpoints/BTV/111,34/forecast?units=us";

fetch(url, {
  headers: {
    "Accept": "application/geo+json",
    "User-Agent": "personal-homepage (test@example.com)"
  }
})
.then(res => res.json())
.then(data => {
  const periods = data.properties.periods;

  // DEBUG: confirm data
  console.log("Periods:", periods);

  const temps = periods
    .slice(0, 12)
    .map(p => p.temperature)
    .filter(t => typeof t === "number");

  console.log("Temps:", temps);

  drawSparkline(temps);
})
.catch(err => console.error(err));

function drawSparkline(values) {
  if (values.length < 2) {
    console.warn("Not enough values to draw");
    return;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 2;
  ctx.beginPath();

  values.forEach((v, i) => {
    const x = (i / (values.length - 1)) * canvas.width;
    const y =
      canvas.height -
      ((v - min) / range) * canvas.height;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}
