const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'KH' + nanoid(5)
}

const CustomerSchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    name : {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type : Date,
    },
    address: {
        type: String,
    }
},{ timestamps: true })
module.exports = Customer = mongoose.model('customers', CustomerSchema);