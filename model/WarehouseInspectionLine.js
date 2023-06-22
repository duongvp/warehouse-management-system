const mongoose = require('mongoose');
const { Schema } = mongoose;

const WarehouseInspectionLineSchema = new Schema({
    productId: {
        type: String,
        ref: 'products'
    },
    warehouseInspectionId: {
        type: String,
        ref: 'whReceipts'
    },
    instock: {
        type: Number
    },
    actualAmount : {
        type: Number
    },
    diffAmount: {
        type: Number,
    },
    diffPrice: {
        type: Number,
    },
    productName :{
        type: String
    },
    unit: {
        type: String
    }
}, { timestamps: true })
module.exports = WarehouseInspectionLine = mongoose.model('whInspectionLines', WarehouseInspectionLineSchema);