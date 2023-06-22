const nanoid = require("nanoid");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const generateID = () => {
  return 'SP' + nanoid(5)
}

const ProductSchema = new Schema({
  _id: {
    type: String,
    default: generateID(),
    unique: true,
    alias: 'id'
},
  status: {
    type: Boolean,
  },
  name: {
    type: String
  },
  image: {
    type: String,
  },
  unitId: {
    type: String,
    ref: 'units'
  },
  categoryId: {
    type: String,
    ref: "category"
  },
  importPrice: {
    type: Number
  },
  costPrice: {
    type: Number
  },
  note: {
    type: String
  },
  warehouse: [{
    _id: false,
    warehouseId: {
      type: String,
      ref: "warehouses"
    },
    instock: {
      type: Number,
      default: 0
    },
  }]
});

module.exports = Product = mongoose.model('products', ProductSchema);
