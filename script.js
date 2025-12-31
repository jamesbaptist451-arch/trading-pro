function pedirPermisoNotificacion() {
  if (!("Notification" in window)) {
    alert("Tu navegador no soporta notificaciones");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      alert("🔔 Notificaciones activadas");
    } else {
      alert("❌ Notificaciones bloqueadas");
    }
  });
}


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
    // verificar alerta
if (alertaActiva && precio >= precioAlerta) {

  if (Notification.permission === "granted") {
    new Notification("🚨 Alerta Trading Pro", {
      body: "BTC alcanzó $" + precioAlerta.toLocaleString("en-US"),
      icon: "icon-192.png"
    });
  } else {
    alert("🚨 BTC alcanzó $" + precioAlerta.toLocaleString("en-US"));
  }

  alertaActiva = false;
  document.getElementById("alert-status").innerText =
    "Alerta disparada ✅";
}



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

// cargar alerta guardada
const alertaGuardada = localStorage.getItem("btcAlerta");

if (alertaGuardada) {
  precioAlerta = Number(alertaGuardada);
  alertaActiva = true;

  document.addEventListener("DOMContentLoaded", () => {
    const status = document.getElementById("alert-status");
    if (status) {
      status.innerText =
        "Alerta cargada en $" + precioAlerta.toLocaleString("en-US");
    }
  });
}

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
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("SW registrado"))
    .catch(err => console.log("SW error", err));
}


