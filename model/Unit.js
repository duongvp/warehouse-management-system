const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;


const generateID = () => {
    return 'DVT' + nanoid(5)
}

const UnitSchema = new Schema({
    _id: {
        type: String,
        default: generateID(),
        unique: true,
        alias: 'id'
    },
    name : {
        type: String,
    }
}, { timestamps: true })
module.exports = Unit = mongoose.model('units', UnitSchema);