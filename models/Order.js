const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            { 
                productId: String,
                quantity: { type: Number, default: 1 }
            }
        ],
        amount: { type: Number, required: true },
        address: { type: Object, rerequired: true }, // Stipre Library returns us an object with user info
        status: { type: String, default: 'Pending' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);