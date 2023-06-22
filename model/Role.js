const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    permissions: [{
      type: Schema.Types.ObjectId,
      ref: 'permissions'
    }]
  });

  module.exports = Role = mongoose.model('roles', RoleSchema);