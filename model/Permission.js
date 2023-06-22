const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parentName: {
    type: String,
    required: true,
  },
  parentDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String
  }
});

  module.exports = Role = mongoose.model('permissions', PermissionSchema);