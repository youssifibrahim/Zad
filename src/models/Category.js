const mongoose = require('mongoose');
const product = require('./Product');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [50, 'Maxlength is 50']
    },
},
    { timestamps: true }
);

categorySchema.pre('findOneAndDelete', async function (next) {
    const categoryId = this.getQuery()._id;
    const defaultCategoryId = process.env.DEFAULT_CATEGORY_ID;

    if (categoryId.toString() === defaultCategoryId) {
        return next(new Error("Cannot delete the default category!"));
    }

    await Product.updateMany(
        { category: categoryId },
        { $set: { category: defaultCategoryId } }
    );
    next();
});

// Categories: vegetables, fruits, dairy, meat, bakery, pantry, Uncategorized

module.exports = mongoose.model('Category', categorySchema);