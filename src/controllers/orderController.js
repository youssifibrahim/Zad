const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');
const SearchFilter = require('../utils/SearchFilter');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createOrderAfterPayment = async (session) => {
    try {
        const userId = session.client_reference_id;
        const addressId = session.metadata.addressId;
        const totalOrderPrice = session.amount_total / 100;

        const cart = await Cart.findOne({ user: userId });
        if (!cart || !cart.items || cart.items.length === 0) throw new Error(messages.CART_EMPTY || 'Cart is empty');

        const address = await Address.findOne({ _id: addressId, user: userId });
        if (!address) throw new Error(messages.ADDRESS_NOT_FOUND || 'Address not found');

        const order = await Order.create({
            user: userId,
            orderItems: cart.items,
            totalPrice: totalOrderPrice,
            paymentMethod: 'Credit Card',
            isPaid: true,
            paidAt: Date.now(),
            shippingAddress: {
                addressId: address._id,
                addressSnapshot: `${address.alias}: ${address.details}, ${address.city}. Phone: ${address.phoneNumber}`
            }
        });

        if (order) {
            const bulkOption = cart.items.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
                },
            }));
            await Product.bulkWrite(bulkOption);
            await Cart.findByIdAndDelete(cart._id);
        }
    } catch (err) {
        console.error("WEBHOOK ORDER ERROR:", err.message);
    }
};

// Create checkout session
exports.getCheckoutSession = async (req, res, next) => {
    try {
        const userId = req.user._id || req.user.id;
        let addressId = (req.body && req.body.addressId) ? req.body.addressId : req.query.addressId;
        if (!addressId) {
            const defaultAddress = await Address.findOne({ user: userId }).sort({ isDefault: -1 });
            if (!defaultAddress) {
                return next(new AppError('No shipping address found. Please add an address to your profile first.', 400));
            }
            addressId = defaultAddress._id;
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart || !cart.items || cart.items.length === 0) {
            return next(new AppError('Your cart is empty. Cannot proceed to checkout.', 400));
        }
        const amount = cart.totalPrice > 0 ? cart.totalPrice : 0;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/api/orders/payment-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/api/orders/payment-cancel`,
            customer_email: req.user.email,
            client_reference_id: userId.toString(),
            metadata: { addressId: addressId.toString() },
            line_items: [{
                price_data: {
                    currency: 'egp',
                    unit_amount: Math.round(amount * 100),
                    product_data: {
                        name: `Order for ${req.user.name}`,
                        description: `Total Items: ${cart.items.length}`,
                    },
                },
                quantity: 1,
            }],
            mode: 'payment',
        });
        res.status(200).json({ status: 'success', session });
    } catch (err) {
        next(new AppError(err.message || 'Error processing checkout session', 500));
    }
};

// Create order (cash)
exports.createOrderFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id || req.user.id;
        let addressId = (req.body && req.body.addressId) ? req.body.addressId : null;
        const paymentMethod = req.body && req.body.paymentMethod;

        if (!addressId) {
            const defaultAddress = await Address.findOne({ user: userId }).sort({ isDefault: -1 });
            if (!defaultAddress) return next(new AppError('Please provide or set a default shipping address.', 400));
            addressId = defaultAddress._id;
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart || !cart.items || cart.items.length === 0) return next(new AppError('Cart is empty', 400));

        const address = await Address.findOne({ _id: addressId, user: userId });
        if (!address) return next(new AppError('Selected address not found', 404));

        const order = await Order.create({
            user: userId,
            orderItems: cart.items,
            shippingAddress: {
                addressId: address._id,
                addressSnapshot: `${address.alias}: ${address.details}, ${address.city}. Phone: ${address.phoneNumber}`
            },
            paymentMethod: paymentMethod || 'Cash on Delivery',
            totalPrice: cart.totalPrice,
            isPaid: false
        });
        const bulkOption = cart.items.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
            },
        }));
        await Product.bulkWrite(bulkOption);
        await Cart.findOneAndDelete({ user: userId });
        res.status(201).json({ status: 'success', data: { order } });
    } catch (err) { next(err); }
};

// Stripe webhook
exports.webhookCheckout = async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        await createOrderAfterPayment(event.data.object);
    }
    res.status(200).json({ received: true });
};


// Retrieve my orders
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
    } catch (err) { next(err); }
};

// Retrieve single order
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email phoneNumber');
        if (!order) return next(new AppError('Order not found', 404));
        res.status(200).json({ status: 'success', data: { order } });
    } catch (err) { next(err); }
};

// Retrieve all
exports.getAllOrders = async (req, res, next) => {
    try {
        const filterTool = new SearchFilter(Order.find().populate('user', 'name email phoneNumber'), req.query)
            .filter().sort().paginate();
        const orders = await filterTool.query;
        res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
    } catch (err) { next(err); }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        if (!order) return next(new AppError('Order not found', 404));
        res.status(200).json({ status: 'success', data: { order } });
    } catch (err) { next(err); }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.orderStatus !== 'Pending') return next(new AppError('Order cannot be cancelled', 400));
        order.orderStatus = 'Cancelled';
        await order.save();
        res.status(200).json({ status: 'success', message: 'Order cancelled successfully' });
    } catch (err) { next(err); }
};

// Orders stats

exports.getCombinedStats = async (req, res, next) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const stats = await Order.aggregate([
            { $match: { isPaid: true } },
            {
                $facet: {
                    daily: [
                        { $match: { createdAt: { $gte: startOfDay } } },
                        { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
                    ],
                    weekly: [
                        { $match: { createdAt: { $gte: startOfWeek } } },
                        { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
                    ],
                    monthly: [
                        { $match: { createdAt: { $gte: startOfMonth } } },
                        { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
                    ],
                    total: [
                        { $group: { _id: null, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const formatResult = (data) => (data && data.length > 0 ? data[0] : { revenue: 0, count: 0 });

        res.status(200).json({
            status: 'success',
            data: {
                daily: formatResult(stats[0].daily),
                weekly: formatResult(stats[0].weekly),
                monthly: formatResult(stats[0].monthly),
                total: formatResult(stats[0].total)
            }
        });
    } catch (err) {
        next(new AppError(err.message || 'خطأ في حساب الإحصائيات', 500));
    }
};

exports.getMonthlyPlan = async (req, res, next) => {
    try {
        const year = req.params.year * 1;
        const plan = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    },
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' },
                    firstDate: { $first: '$createdAt' }
                }
            },
            {
                $addFields: {
                    monthName: {
                        $dateToString: { format: '%B', date: '$firstDate' }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    monthName: 1,
                    numOrders: 1,
                    totalSales: 1
                }
            }
        ]);

        res.status(200).json({ status: 'success', data: { plan } });
    } catch (err) {
        next(err);
    }
};