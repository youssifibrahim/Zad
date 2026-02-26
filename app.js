const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const AppError = require('./src/utils/AppError');
const globalErrorHandler = require('./src/controllers/errorController');

// ROUTERS
const userRouter = require('./src/routes/userRouter');
const addressRouter = require('./src/routes/addressRouter');
const categoryRouter = require('./src/routes/categoryRouter');
const productRouter = require('./src/routes/productRouter');
const orderRouter = require('./src/routes/orderRouter');
const cartRouter = require('./src/routes/cartRouter');
const couponRouter = require('./src/routes/couponRouter');

// CONTROLLERS
const orderController = require('./src/controllers/orderController');

const app = express();

// GLOBAL MIDDLEWARE
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "res.cloudinary.com", "data:"],
      },
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// STRIPE WEBHOOK
app.post(
  '/api/webhook-checkout',
  express.raw({ type: 'application/json' }), 
  orderController.webhookCheckout
);

// BODY PARSERS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// RATE LIMITING
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

// ROUTES APIS
app.use('/api/users', userRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/coupons', couponRouter);

// ERROR HANDLING
app.all('*all', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;