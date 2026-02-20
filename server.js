const express = require('express');
const cors = require('cors'); // <--- 1. ¡DEBES TENER ESTO!
const app = express();

app.use(cors()); // <--- 2. Habilita que tu web de GitHub pueda entrar
app.use(express.json());

// 3. Esto quitará el "Cannot GET /" y te dirá que el servidor está vivo
app.get("/", (req, res) => {
    res.send("Servidor de DeMasita funcionando correctamente.");
});

// 4. Tu ruta de pagos (asegúrate que sea POST)
app.post("/create_preference", async (req, res) => {
    // Aquí va tu código de Mercado Pago...
});
