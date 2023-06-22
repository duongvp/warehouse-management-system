const mongoose = require('mongoose');
const { Schema } = mongoose;

const WarehouseDeliveryLineSchema = new Schema({
    productId: {
        type: String,
        ref: 'products'
    },
    warehouseDeliveryId: {
        type: String,
        ref: 'whDelivery'
    },
    productName :{
        type: String
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
module.exports = WarehouseReceiptLine = mongoose.model('whDeliveryLines', WarehouseDeliveryLineSchema);