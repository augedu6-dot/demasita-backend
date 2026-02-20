const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors()); // Permitir que tu web de GitHub acceda

// Configura tus credenciales (Token de prueba o producción)
const client = new MercadoPagoConfig({ accessToken: 'TU_ACCESS_TOKEN_AQUI' });

app.post('/create_preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: 'Pedido DeMasita - ' + req.body.idPedido,
                        quantity: 1,
                        unit_price: Number(req.body.total),
                        currency_id: 'MXN'
                    }
                ],
                back_urls: {
                    success: "https://augedu6-dot.github.io/lukasecurity.github.io/seguimiento.html",
                    failure: "https://augedu6-dot.github.io/lukasecurity.github.io/carrito.html",
                    pending: "https://augedu6-dot.github.io/lukasecurity.github.io/seguimiento.html"
                },
                auto_return: "approved",
            }
        });

        // Enviamos el link de pago al frontend
        res.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la preferencia");
    }
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));