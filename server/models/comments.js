var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
  text: String,
  author: String,
  upvotes: {type: Number, default: 0},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

module.exports = mongoose.model('Comment', CommentSchema);