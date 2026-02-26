const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Maxlength is 50']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is wrong']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'It must be at least 8 characters long.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password does not match'
        }
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true,
        validate: {
            validator: function (val) {
                return validator.isMobilePhone(val, 'ar-EG')
            },
            message: 'Incorrect phone number!'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['customer', 'admin', 'delivery'],
            message: 'The role is incorrect!'
        },
        default: 'customer'
    }
},
    { timestamps: true }
);

// --- Middleware Hooks ---

// Hashing password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
}
);

// Password validation
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await
        bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema);