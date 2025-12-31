async function cargarPrecioBTC() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = await res.json();

    const precio = data.bitcoin.usd;
    document.getElementById("btc-price").innerText =
      "$" + precio.toLocaleString("en-US");
  } catch (error) {
    document.getElementById("btc-price").innerText =
      "Error cargando precio";
  }
}

// cargar al iniciar
cargarPrecioBTC();

// actualizar cada 10 segundos
setInterval(cargarPrecioBTC, 10000);
