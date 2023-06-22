const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'KTK' + nanoid(5)
}

const WarehouseInspectionSchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    employId: {
        type: String,
        ref: 'users'
    },
    totalDiffAmount: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    totalDiffPrice: {
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
module.exports = WarehouseInspection = mongoose.model('whInspection', WarehouseInspectionSchema);