const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IdeaSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  years_active: {
    type: Number,
    required: true
  },
  album:{
    type: String,
    required: true
  },
  releaseDate:{
    type: Date,
    required: true,
    default: Date.now()
  }
});

mongoose.model('ideas', IdeaSchema);
