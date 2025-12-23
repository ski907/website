const CACHE_HOURS = 1;

document.querySelectorAll(".spark-row").forEach(initSpark);

function initSpark(row) {
  const grid = row.dataset.grid;
  const canvas = row.querySelector("canvas");
  const rangeEl = row.querySelector(".range");
  const ctx = canvas.getContext("2d");

  fetchForecast(grid).then(temps => {
    drawSparkline(ctx, canvas, temps);
    updateRange(rangeEl, temps);
    addHover(canvas, temps);
  });
}

function fetchForecast(grid) {
  const cacheKey = `nws-${grid}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { time, temps } = JSON.parse(cached);
    if (Date.now() - time < CACHE_HOURS * 3600e3) {
      return Promise.resolve(temps);
    }
  }

  const url = `https://api.weather.gov/gridpoints/${grid}/forecast?units=us`;

  return fetch(url, {
    headers: {
      "Accept": "application/geo+json",
      "User-Agent": "personal-homepage (test@example.com)"
    }
  })
    .then(r => r.json())
    .then(data => {
      const temps = data.properties.periods
        .slice(0, 12)
        .map(p => p.temperature)
        .filter(t => typeof t === "number");

      localStorage.setItem(
        cacheKey,
        JSON.stringify({ time: Date.now(), temps })
      );

      return temps;
    });
}

function drawSparkline(ctx, canvas, values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Freeze line
  if (min < 32 && max > 32) {
    const yFreeze =
      canvas.height -
      ((32 - min) / range) * canvas.height;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, yFreeze);
    ctx.lineTo(canvas.width, yFreeze);
    ctx.stroke();
  }

  // Color encoding
  ctx.strokeStyle =
    max <= 32 ? "#5dade2" :
    min >= 32 ? "#e67e22" :
    "#4cc9f0";

  ctx.lineWidth = 2;
  ctx.beginPath();

  values.forEach((v, i) => {
    const x = (i / (values.length - 1)) * canvas.width;
    const y =
      canvas.height -
      ((v - min) / range) * canvas.height;

    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.stroke();
}

function updateRange(el, values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  el.textContent = `${Math.round(min)}–${Math.round(max)}°F`;
}

function addHover(canvas, values) {
  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const i = Math.round(
      ((e.clientX - rect.left) / canvas.width) *
      (values.length - 1)
    );
    canvas.title = `${values[i]}°F`;
  });
}
