const express = require('express');
const cors = require('cors'); // Requerimos CORS para dar permiso a tu web
const mercadopago = require('mercadopago');
const app = express();

// 1. CONFIGURACIÓN DE MERCADO PAGO
// Usa tu Access Token de producción (empieza con APP_USR-)
mercadopago.configure({
    access_token: 'TU_ACCESS_TOKEN_AQUÍ' 
});

// 2. MIDDLEWARES (Configuraciones de seguridad y datos)
app.use(express.json());
app.use(cors()); // <--- ¡ESTO ARREGLA EL ERROR DE CONEXIÓN!

// 3. RUTA DE PRUEBA (Para ver que el servidor está vivo)
app.get("/", (req, res) => {
    res.send("Servidor de DeMasita Online y Autorizado.");
});

// 4. RUTA PARA CREAR EL PAGO (POST /create_preference)
app.post("/create_preference", async (req, res) => {
    try {
        const { total, idPedido } = req.body;

        // Validamos que lleguen los datos
        if (!total || !idPedido) {
            return res.status(400).json({ error: "Faltan datos: total o idPedido" });
        }

        // Creamos la preferencia de Mercado Pago
        let preference = {
            items: [
                {
                    title: `Pedido DeMasita #${idPedido}`,
                    unit_price: Number(total), // Forzamos que sea un número
                    quantity: 1,
                    currency_id: 'MXN' // Cambia a tu moneda si no es México
                }
            ],
            back_urls: {
                success: "https://augedu6-dot.github.io/lukasecurity.github.io/seguimiento.html",
                failure: "https://augedu6-dot.github.io/lukasecurity.github.io/carrito.html",
                pending: "https://augedu6-dot.github.io/lukasecurity.github.io/seguimiento.html"
            },
            auto_return: "approved",
            external_reference: idPedido, // Guardamos tu ID de pedido aquí también
        };

        const response = await mercadopago.preferences.create(preference);
        
        // Enviamos el link de pago (init_point) de vuelta a tu página
        res.json({
            init_point: response.body.init_point
        });

    } catch (error) {
        console.error("Error en Mercado Pago:", error);
        res.status(500).json({ error: "No se pudo crear el pago" });
    }
});

// 5. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
