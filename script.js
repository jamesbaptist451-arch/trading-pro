let btcChart;
let labels = [];
let prices = [];

async function cargarPrecioBTC() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = await res.json();
    const precio = data.bitcoin.usd;

    document.getElementById("btc-price").innerText =
      "$" + precio.toLocaleString("en-US");

    const hora = new Date().toLocaleTimeString();

    labels.push(hora);
    prices.push(precio);

    if (labels.length > 20) {
      labels.shift();
      prices.shift();
    }

    if (!btcChart) {
      const ctx = document.getElementById("btcChart").getContext("2d");
      btcChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "BTC USD",
            data: prices,
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { ticks: { color: "#94a3b8" } },
            y: { ticks: { color: "#94a3b8" } }
          }
        }
      });
    } else {
      btcChart.update();
    }

  } catch (error) {
    document.getElementById("btc-price").innerText = "Error";
  }
}

cargarPrecioBTC();
setInterval(cargarPrecioBTC, 10000);
let precioAlerta = null;
let alertaActiva = false;

function activarAlerta() {
  const input = document.getElementById("alert-price").value;

  if (!input || input <= 0) {
    alert("Ingresa un precio válido");
    return;
  }

  precioAlerta = Number(input);
  alertaActiva = true;

  document.getElementById("alert-status").innerText =
    "Alerta activada en $" + precioAlerta.toLocaleString("en-US");
}

// Modificar esta parte dentro de cargarPrecioBTC()
