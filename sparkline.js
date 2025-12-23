const canvas = document.getElementById("tempSpark");
const ctx = canvas.getContext("2d");

canvas.width = 220;
canvas.height = 40;

const url = "https://api.weather.gov/gridpoints/BTV/111,34/forecast?units=us";

fetch(url, {
  headers: {
    "Accept": "application/geo+json",
    // REQUIRED by NWS policy — browsers include a UA,
    // but explicitly identifying your app improves reliability
    "User-Agent": "personal-homepage (your-email@example.com)"
  }
})
.then(res => {
  console.log("Fetch status:", res.status);
  return res.json();
})
.then(data => {
  console.log("NWS data:", data);

  const temps = data.properties.periods
    .slice(0, 12)
    .map(p => p.temperature);

  drawSparkline(temps);
})
.catch(err => {
  console.error("Fetch error:", err);
});

function drawSparkline(values) {
  if (values.length < 2) return;

  const min = Math.min(...values);
  const max = Math.max(...values);

  // prevent divide-by-zero if temps are flat
  const range = max - min || 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  values.forEach((v, i) => {
    const x = (i / (values.length - 1)) * canvas.width;
    const y = canvas.height -
      ((v - min) / range) * canvas.height;

    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.stroke();
}
