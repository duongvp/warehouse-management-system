const mongoose = require('mongoose');
const { Schema } = mongoose;

const WarehouseReceiptLineSchema = new Schema({
    productId: {
        type: String,
        ref: 'products'
    },
    productName : {
        type: String
    },
    warehouseReceiptId: {
        type: String,
        ref: 'whReceipts'
    },
    quantity: {
        type: Number
    },
    unit: {
        type: String
    },
    price : {
        type: Number
    },
    totalPrice: {
        type: Number,
    }
}, { timestamps: true })
module.exports = WarehouseReceiptLine = mongoose.model('whReceiptLines', WarehouseReceiptLineSchema);