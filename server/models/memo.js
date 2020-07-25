const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
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
  textColor: {
    type: String,
    required: true,
    default: '#000000'
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const Gram = mongoose.model('Memo', memoSchema);

module.exports = Gram;
