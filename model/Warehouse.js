const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'KHO' + nanoid(5)
}

const WarehouseSchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    }
}, { timestamps: true })
module.exports = Warehouse = mongoose.model('warehouses', WarehouseSchema); 