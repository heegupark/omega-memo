const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
