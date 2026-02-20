const express = require('express');
const cors = require('cors'); // Requerimos el paquete
const app = express();

app.use(cors()); // <--- ¡ESTA LÍNEA ES LA MAGIA! Permite la conexión
app.use(express.json());

// Tu ruta de Mercado Pago
app.post("/create_preference", async (req, res) => {
    // ... tu código actual ...
});
