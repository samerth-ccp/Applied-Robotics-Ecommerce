const express = require("express");
const stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY ||
        "sk_test_51RrQMWAicdvqG4FAfkp3Icn8XtZa8BetPApcma2Vl2kR2fRaG4ve94YVBYJZVZWUbXq4zj07eJT716aOfH3lyWjo001adtn8xp",
);
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(".", {
    setHeaders: (res, path) => {
        if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.webp')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
})); // Serve static files from current directory

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No items provided" });
        }

        // Calculate total quantity for success URL
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item) => {
                // Determine image based on product name
                let imageUrl = "https://your-domain.com/img/smart_ring.avif";
                if (item.name.toLowerCase().includes("blood pressure")) {
                    imageUrl = "https://your-domain.com/img/blood_pressure_monitor.jpg";
                } else if (item.name.toLowerCase().includes("smart ring")) {
                    imageUrl = "https://your-domain.com/img/smart_ring.avif";
                }

                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.size ? `${item.name} (${item.size})` : item.name,
                            images: [imageUrl],
                        },
                        unit_amount: item.price,
                    },
                    quantity: item.quantity,
                };
            }),
            mode: "payment",
            success_url: `${req.protocol}://${req.get("host")}/success?quantity=${totalQuantity}&total=${totalAmount}`,
            cancel_url: `${req.protocol}://${req.get("host")}/cart.html`,
            metadata: {
                products: JSON.stringify(items.map(item => ({ name: item.name, quantity: item.quantity, size: item.size }))),
                company: "Applied Robotics",
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Stripe events
app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        const endpointSecret = "whsec_your_webhook_secret"; // Replace with your webhook secret

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                endpointSecret,
            );
        } catch (err) {
            console.error(
                "Webhook signature verification failed:",
                err.message,
            );
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                console.log("Payment successful for session:", session.id);
                // Here you would typically:
                // 1. Update order status in your database
                // 2. Send confirmation email
                // 3. Update inventory
                // 4. Create shipping label
                break;
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("Payment succeeded:", paymentIntent.id);
                break;
            case "payment_intent.payment_failed":
                const failedPayment = event.data.object;
                console.log("Payment failed:", failedPayment.id);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    },
);

// Success page
app.get("/success", (req, res) => {
    // Get quantity from query parameters
    const quantity = req.query.quantity || 1;
    const total = (quantity * 249.99).toFixed(2);

    // Read the success.html file
    let html = fs.readFileSync(path.join(__dirname, "success.html"), "utf8");

    // Replace the static values with dynamic ones
    html = html.replace(
        'id="quantity-display">Quantity: 1',
        `id="quantity-display">Quantity: ${quantity}`,
    );
    html = html.replace(
        'id="price-display">Price: $249.99',
        `id="price-display">Price: $${total}`,
    );

    res.send(html);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log("Stripe integration ready!");
    console.log("Make sure to:");
    console.log("1. Update webhook endpoint in Stripe dashboard");
    console.log("2. Replace webhook secret in server.js");
    console.log("3. Update image URLs in checkout session");
});
