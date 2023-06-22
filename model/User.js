const nanoid = require("nanoid");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateID = () => {
  return 'QL' + nanoid(5)
}

const UserSchema = new Schema({
  _id: {
    type: String,
    default: generateID(),
    unique: true,
    alias: 'id'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  avatar: {
    type: String
  },
  status: { type: Boolean },
  warehouseId: [{
    type: String,
    ref: "warehouses"
  }],
  role: {
    type: Schema.Types.ObjectId,
    ref: 'roles'
  }
},{ timestamps: true });

module.exports = User = mongoose.model('users', UserSchema);
