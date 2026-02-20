const express = require('express');
const cors = require('cors'); // Requerimos CORS para dar permiso a tu web
const mercadopago = require('mercadopago');
const app = express();

// 1. CONFIGURACIÓN DE MERCADO PAGO
// Usa tu Access Token de producción (empieza con APP_USR-)
mercadopago.configure({
    access_token: 'APP_USR-3446947306015470-022015-0eadd73bad309d682d67155b9902caf9-2388126686' 
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
                    unit_price: Number(total),
                    quantity: 1,
                    currency_id: 'MXN'
                }
            ],
            // --- CONFIGURACIÓN PARA IR DIRECTO A TARJETA ---
            payment_methods: {
                excluded_payment_types: [
                    { id: "ticket" },       // Quita OXXO/Efectivo
                    { id: "atm" },          // Quita Cajeros/Transferencias
                    { id: "bank_transfer" } // Quita SPEI
                ],
                installments: 1, // Opcional: Solo 1 pago (sin meses)
            },
            // binary_mode: true hace que el pago se apruebe o rechace al instante
            // sin quedar "pendiente"
            binary_mode: true, 
            
            // Esto ayuda a que no sea obligatorio loguearse
            back_urls: {
                success: "https://augedu6-dot.github.io/lukasecurity.github.io/seguimiento.html",
                failure: "https://augedu6-dot.github.io/lukasecurity.github.io/carrito.html",
                pending: "https://augedu6-dot.github.io/lukasecurity.github.io/seguimiento.html"
            },
            auto_return: "approved",
            external_reference: idPedido,
        };

// 5. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
