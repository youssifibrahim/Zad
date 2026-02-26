const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');

// Add product to cart
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const product = await Product.findById(productId);
        if (!product) return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));
        let cart = await Cart.findOne({ user: userId });
        const newItem = {
            product: productId,
            name: product.name,
            quantity: quantity || 1,
            price: product.price,
            unitDetails: {
                unit: product.unit,
                value: product.unitValue
            }
        };
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [newItem]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += (quantity || 1);
                cart.items[itemIndex].price = product.price;
                cart.items[itemIndex].unitDetails = {
                    unit: product.unit,
                    value: product.unitValue
                };
            } else {
                cart.items.push(newItem);
            }
        }
        // Calculate total price
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await cart.save();
        res.status(200).json({
            status: 'success',
            data: { cart }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve cart
exports.getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'image name');
        if (!cart) {
            return res.status(200).json({
                status: 'success',
                message: messages.CART_EMPTY,
                data: { items: [], totalPrice: 0 }
            });
        }
        res.status(200).json({
            status: 'success',
            data: { cart }
        });
    } catch (err) {
        next(err);
    }
};

// Update cart quantity
exports.updateCartQuantity = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return next(new AppError(messages.CART_EMPTY, 404));
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));
        }
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            const product = await Product.findById(productId);
            if (!product) return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));

            if (product.stock < quantity) {
                return next(new AppError(messages.INSUFFICIENT_STOCK, 400));
            }
            // update stock
            cart.items[itemIndex].quantity = quantity;
        }
        cart.totalPrice = cart.items.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);
        await cart.save();
        res.status(200).json({
            status: 'success',
            data: { cart }
        });
    } catch (err) {
        next(err);
    }
};

// Delete single item from cart
exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return next(new AppError(messages.CART_EMPTY, 404));
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await cart.save();
        res.status(200).json({
            status: 'success',
            data: { cart }
        });
    } catch (err) {
        next(err);
    }
};

// Delete all items
exports.clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndDelete({ user: req.user.id });
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};