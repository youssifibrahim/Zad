const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const messages = require('../utils/errorMessages');
const SearchFilter = require('../utils/SearchFilter');
const { cloudinary, upload } = require('../config/cloudinary');

// Create product
exports.createProduct = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }
        const product = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve all 
exports.getAllProducts = async (req, res, next) => {
    try {
        const filterTool = new SearchFilter(Product.find(), req.query)
            .filter()
            .search()
            .sort()
            .paginate();
        const products = await filterTool.query;
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        next(err);
    }
};

// Retrieve single product
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        next(err);
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        if (req.file) {
            // Geting the old image url
            const productToUpdate = await Product.findById(req.params.id);
            if (!productToUpdate) {
                return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));
            }

            // Delete the old image from cloudinary
            if (productToUpdate.image) {
                const publicIdWithExtension = productToUpdate.image.split('/').pop();
                const publicId = publicIdWithExtension.split('.')[0];
                const folderName = process.env.CLOUDINARY_FOLDER_NAME;
                await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
            }

            req.body.image = req.file.path;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        next(err);
    }
};

// Delete product 
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError(messages.PRODUCT_NOT_FOUND, 404));
        }

        // Delete image from cloudinary
        if (product.image) {
            // Get file name 
            const publicIdWithExtension = product.image.split('/').pop();
            const publicId = publicIdWithExtension.split('.')[0];
            // Get full path
            const fullPath = `${process.env.CLOUDINARY_FOLDER_NAME}/${publicId}`;
            await cloudinary.uploader.destroy(fullPath);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};