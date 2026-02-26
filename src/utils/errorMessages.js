module.exports = {
    // --- 1000 Series: Authentication & Users ---
    EMAIL_REQUIRED: { code: 1001, message: 'Email address required' },
    INVALID_EMAIL: { code: 1002, message: 'The email format is incorrect.' },
    PHONE_REQUIRED: { code: 1003, message: 'Phone number is required' },
    INVALID_PHONE: { code: 1004, message: 'Invalid phone number format' },
    LOGIN_FAILED: { code: 1005, message: 'Incorrect login details' },
    USER_EXISTS: { code: 1006, message: 'This user is already registered' },
    USER_NOT_FOUND: { code: 1007, message: 'User not found or does not exist' },
    PASSWORD_TOO_SHORT: { code: 1008, message: 'Password must be at least 8 characters' },
    PASSWORDS_NOT_MATCH: { code: 1009, message: 'Passwords do not match' },

    // --- 2000 Series: Products & Inventory ---
    PRODUCT_NOT_FOUND: { code: 2001, message: 'Product not found' },
    PRODUCT_NAME_REQUIRED: { code: 2005, message: 'Product name is required' },
    PRODUCT_DESC_REQUIRED: { code: 2006, message: 'Product description is required' },
    PRODUCT_PRICE_REQUIRED: { code: 2007, message: 'Product price is required' },
    PRODUCT_UNIT_REQUIRED: { code: 2008, message: 'Product unit (kg, g, etc.) is required' },
    INVALID_UNIT: { code: 2009, message: 'Invalid unit provided' },
    PRODUCT_CAT_REQUIRED: { code: 2010, message: 'Product category is required' },
    INVALID_CATEGORY: { code: 2011, message: 'Invalid category provided' },
    STOCK_REQUIRED: { code: 2012, message: 'Stock quantity is required' },
    INSUFFICIENT_STOCK: { code: 2013, message: 'The requested quantity exceeds available stock' },
    CATEGORY_NOT_FOUND: { code: 2014, message: 'Category not found' },
    INVALID_FILE_TYPE: { code: 2015, message: 'Only (.jpg, .jpeg, .png, .webp) files are allowed!' },

    // --- 3000 Series: Authorization & Security ---
    NOT_LOGGED_IN: { code: 3001, message: 'Please log in first.' },
    NO_PERMISSION: { code: 3002, message: 'You do not have the authority to perform this action' },
    INVALID_TOKEN: { code: 3003, message: 'Invalid or expired token. Please log in again' },

    // --- 4000 Series: Orders & Cart ---
    CART_EMPTY: { code: 4001, message: 'Your cart is empty' },
    ORDER_NOT_FOUND: { code: 4002, message: 'Order not found' },
    ORDER_ALREADY_PAID: { code: 4003, message: 'This order has already been paid for' },
    INVALID_ORDER_STATUS: { code: 4004, message: 'Invalid status transition for this order' },
    ORDER_CREATION_FAILED: { code: 4005, message: 'Order creation failed after payment process, please check the details' },
    ORDER_SUCCESS: { code: 4006, message: 'The order was successfully created and the cart was cleared' },
    CANNOT_CANCEL_ORDER: { code: 4007, message: 'The order cannot be cancelled, as it has already been confirmed or shipped'},
    ORDER_CANCELLED_SUCCESS: { code: 4007, message: 'The order has been successfully cancelled'},

    // --- 5000 Series: Payments & Coupons ---
    PAYMENT_FAILED: { code: 5001, message: 'Payment processing failed. Please try again.' },
    COUPON_EXPIRED: { code: 5002, message: 'This coupon code has expired' },
    INVALID_COUPON: { code: 5003, message: 'Invalid coupon code' },
    COUPON_ALREADY_USED: { code: 5004, message: 'You have already used this coupon code' },

    // --- 7000 Series: Addresses ---
    ADDRESS_REQUIRED: { code: 7001, message: 'Please provide a shipping address' },
    ADDRESS_NOT_FOUND: { code: 7002, message: 'The specified address was not found' },

    // --- 9000 Series: General & Technical ---
    INTERNAL_SERVER_ERROR: { code: 9000, message: 'Something went very wrong on our end' },
    VALIDATION_ERROR: { code: 9001, message: 'Invalid input data' },
    ROUTE_NOT_FOUND: { code: 9002, message: 'The requested route was not found' },
    UPLOAD_FAILED: { code: 9003, message: 'Image upload failed' }
};