const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'PN' + nanoid(5)
}

const WarehouseReceiptSchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    supplierId: {
        type: String,
        ref: 'suppliers'
    },
    employId: {
        type: String,
        ref: 'users'
    },
    discountMount: {
        type: Number,
    },
    paidSupplier: {
        type: Number,
    }, 
    debt: {
        type: Number,
    },
    totalPrice: {
        type: Number,
    },
    note: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    warehouseId: {
        type: String,
        ref: "warehouses"
    },
}, { timestamps: true })
module.exports = WarehouseReceipt = mongoose.model('whReceipts', WarehouseReceiptSchema);