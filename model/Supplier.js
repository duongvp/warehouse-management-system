const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'NCC' + nanoid(5)
}

const SupplierSchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    name : {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
}, { timestamps: true })
module.exports = Supplier = mongoose.model('suppliers', SupplierSchema);