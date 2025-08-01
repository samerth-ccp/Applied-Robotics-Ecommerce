# Applied Robotics - Heart Monitor E-commerce Website

A complete e-commerce website for Applied Robotics selling the Auro Ring Heart Rate Monitor with integrated Stripe payment processing.

## 🏥 Features

- **Single Product Focus**: Auro Ring Heart Rate Monitor
- **Dark Header Design**: Modern dark navigation header
- **Stripe Integration**: Complete payment processing
- **Responsive Design**: Works on all devices
- **Professional Branding**: Applied Robotics healthcare technology

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Stripe account

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Website**
   - Open your browser and go to `http://localhost:3000`
   - The website will be fully functional with Stripe checkout

## 💳 Stripe Configuration

### Current Setup
- **Publishable Key**: `pk_test_51RrQMWAicdvqG4FAOpp4PrpbUysLzY6lBuJNyzBJwGJBFijQHRFhn3Yj1CgwjTSpqDMMDzHsVO8sZjUI56I4Ogvc008L14DcCZ`
- **Secret Key**: `sk_test_51RrQMWAicdvqG4FAfkp3Icn8XtZa8BetPApcma2Vl2kR2fRaG4ve94YVBYJZVZWUbXq4zj07eJT716aOfH3lyWjo001adtn8xp`

### For Production
1. Replace test keys with live keys in `server.js`
2. Update webhook endpoint in Stripe dashboard
3. Set up proper webhook secret

## 📁 File Structure

```
├── index.html          # Homepage
├── shop.html          # Product listing
├── cart.html          # Shopping cart with Stripe checkout
├── sproduct.html      # Product details
├── success.html       # Order confirmation page
├── server.js          # Node.js backend with Stripe integration
├── package.json       # Dependencies and scripts
├── style.css          # Styling
├── script.js          # Frontend JavaScript
└── img/              # Product images
    └── heart_monitor.jpg
```

## 🔧 Backend Features

### API Endpoints
- `POST /create-checkout-session` - Creates Stripe checkout session
- `POST /webhook` - Handles Stripe webhook events
- `GET /success` - Order confirmation page

### Webhook Events Handled
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed

## 🎨 Design Features

- **Dark Header**: Modern dark navigation with white text
- **Single Product**: Focused on Auro Ring Heart Rate Monitor
- **Professional Branding**: Applied Robotics healthcare theme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Stripe Integration**: Seamless payment processing

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set up environment variables
2. Update Stripe keys to live keys
3. Configure webhook endpoints
4. Deploy to your preferred hosting service

## 📞 Support

For technical support or questions about the Stripe integration, please contact the development team.

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Applied Robotics** - Advancing Healthcare Technology
