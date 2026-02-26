const Address = require('../models/Address');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');

// Create address
exports.addAddress = async (req, res, next) => {
    try {
        if (!req.body.phoneNumber) {
            req.body.phoneNumber = req.user.phoneNumber;
        }
        if (req.body.isDefault === true) {
            await Address.updateMany(
                { user: req.user.id },
                { isDefault: false }
            );
        }
        const address = await Address.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json({
            status: 'success',
            data: { address }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve my addresses
exports.getMyAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.find({ user: req.user.id }).sort('-isDefault -createdAt');
        res.status(200).json({
            status: 'success',
            results: addresses.length,
            data: { addresses }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve single address
exports.getSingleAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
        if (!address) {
            return next(new AppError(messages.ADDRESS_NOT_FOUND, 404));
        }
        res.status(200).json({
            status: 'success',
            data: { address }
        });
    } catch (err) {
        next(err);
    }
};

// Update address
exports.updateAddress = async (req, res, next) => {
    try {
        if (req.body.isDefault === true) {
            await Address.updateMany(
                { user: req.user.id },
                { isDefault: false }
            );
        }
        const address = await Address.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!address) {
            return next(new AppError(messages.ADDRESS_NOT_FOUND, 404));
        }
        res.status(200).json({
            status: 'success',
            data: { address }
        });
    } catch (err) {
        next(err);
    }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!address) {
            return next(new AppError(messages.ADDRESS_NOT_FOUND, 404));
        }
        if (address.isDefault) {
            const nextAddress = await Address.findOne({ user: req.user.id });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};