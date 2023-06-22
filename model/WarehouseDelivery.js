const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'PX' + nanoid(5)
}

const WarehouseDeliverySchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    customerId: {
        type: String,
        ref: 'customers'
    },
    employId: {
        type: String,
        ref: 'users'
    },
    discountMount: {
        type: Number,
    },
    customerPaid: {
        type: Number,
    }, 
    debtors: {
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
    totalAmount : {
        type: Number
    }
}, { timestamps: true })
module.exports = WarehouseDelivery = mongoose.model('whDelivery', WarehouseDeliverySchema);