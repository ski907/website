const canvas = document.getElementById("tempSpark");
const ctx = canvas.getContext("2d");

// Match canvas resolution to CSS size
canvas.width = 220;
canvas.height = 40;

const url = "https://api.weather.gov/gridpoints/BTV/111,34/forecast?units=us";

fetch(url, {
  headers: {
    "Accept": "application/geo+json",
    "Feature-Flags": "forecast_temperature_qv"
  }
})
.then(res => res.json())
.then(data => {
  // Take first ~24 hours (12 periods = day/night)
  const temps = data.properties.periods
    .slice(0, 12)
    .map(p => p.temperature);

  drawSparkline(temps);
});

function drawSparkline(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = 4;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  values.forEach((v, i) => {
    const x = (i / (values.length - 1)) * canvas.width;
    const y = canvas.height - padding -
      ((v - min) / (max - min)) * (canvas.height - padding * 2);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}
