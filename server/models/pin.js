const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  memo: {
    type: String,
    required: false,
    trim: true
  },
  positionX: {
    type: Number,
    required: true,
    trim: true
  },
  positionY: {
    type: Number,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    default: '#ffffff'
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const Gram = mongoose.model('Pin', pinSchema);

module.exports = Gram;
