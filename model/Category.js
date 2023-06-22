const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'DM' + nanoid(5)
}

const CategorySchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    name : {
        type: String,
    }
},{ timestamps: true })
module.exports = Category = mongoose.model('category', CategorySchema);