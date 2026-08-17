require('dotenv').config();

const express = require('express');
const SSLCommerzPayment = require('sslcommerz-lts');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const STORE_ID = process.env.SSL_STORE_ID ;
const STORE_PASSWORD = process.env.SSL_STORE_PASSWORD ;
const SSL_MODE = process.env.SSL_COMMERZ_MODE || 'sandbox';
const isDemoMode = SSL_MODE === 'demo';

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

const products = [
  {
    id: 'p1',
    name: 'Classic Tee',
    price: 850,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: 'Soft cotton t-shirt for everyday use.',
  },
  {
    id: 'p2',
    name: 'Urban Backpack',
    price: 2200,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: 'Durable backpack with multiple compartments.',
  },
  {
    id: 'p3',
    name: 'Smart Watch',
    price: 3200,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Track fitness and receive notifications.',
  },
  {
    id: 'p4',
    name: 'Minimal Lamp',
    price: 1800,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    description: 'Warm ambient lighting for modern spaces.',
  },
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: SSL_MODE,
    storeId: STORE_ID,
  });
});

app.get('/api/products', (req, res) => {
  res.json({ products });
});

app.post('/api/payment/initiate', async (req, res) => {
  const { customer, items, shippingAddress } = req.body || {};

  if (!customer || !Array.isArray(items) || !items.length) {
    return res.status(400).json({
      success: false,
      message: 'Customer and cart items are required.',
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 120 : 0;
  const total = subtotal + shipping;
  const transactionId = `demo_${Date.now()}`;

  const payload = {
    total_amount: total,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${CLIENT_URL}/checkout/success?source=sslcommerz&tran_id=${encodeURIComponent(transactionId)}&amount=${total}`,
    fail_url: `${CLIENT_URL}/checkout/failure?source=sslcommerz&tran_id=${encodeURIComponent(transactionId)}`,
    cancel_url: `${CLIENT_URL}/checkout/cancel?source=sslcommerz&tran_id=${encodeURIComponent(transactionId)}`,
    shipping_method: 'NO',
    product_name: items.map((item) => item.name).join(', ').slice(0, 50),
    product_category: 'General',
    product_profile: 'general',
    cus_name: customer.name,
    cus_email: customer.email,
    cus_phone: customer.phone,
    cus_add1: shippingAddress?.address || 'Demo address',
    cus_city: shippingAddress?.city || 'Dhaka',
    cus_postcode: shippingAddress?.zip || '1000',
    cus_country: 'Bangladesh',
    shipping_address: shippingAddress?.address || 'Demo address',
    shipping_city: shippingAddress?.city || 'Dhaka',
    shipping_postcode: shippingAddress?.zip || '1000',
    shipping_country: 'Bangladesh',
  };

  if (isDemoMode) {
    return res.json({
      success: true,
      gateway_url: `${CLIENT_URL}/checkout/success?demo=true&tran_id=${payload.tran_id}&amount=${payload.total_amount}`,
      message: 'Demo mode active: SSLCommerz simulation enabled for learning.',
      order: {
        amount: payload.total_amount,
        tran_id: payload.tran_id,
        status: 'SUCCESS',
      },
    });
  }

  try {
    const isLive = SSL_MODE === 'live';
    const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, isLive);
    const response = await sslcz.init(payload);

    if (!response || response.status !== 'SUCCESS') {
      return res.status(400).json({
        success: false,
        message: 'SSLCommerz session creation failed.',
        detail: response,
      });
    }

    const gatewayUrl = response.GatewayPageURL || response.redirectGatewayURL || response.gateway_url;

    if (!gatewayUrl) {
      return res.status(400).json({
        success: false,
        message: 'SSLCommerz did not return a gateway URL.',
        detail: response,
      });
    }

    return res.json({
      success: true,
      gateway_url: gatewayUrl,
      order: {
        amount: response.amount || payload.total_amount,
        tran_id: payload.tran_id,
      },
    });
  } catch (error) {
    console.error('SSLCommerz error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating the SSLCommerz payment session.',
      detail: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`SSLCommerz mode: ${SSL_MODE}`);
});
