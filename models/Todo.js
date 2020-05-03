const mongoose = require('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  date: { type: Date, default: Date.now },
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Todo', TodoSchema);