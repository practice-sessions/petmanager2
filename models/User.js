const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactnumber: {
    type: Number,
    required: true,
    index: true,
    unique: true
  },
  email: {
    type: String,
    //required: true,
    index: true,
    unique: true,
    //sparse: true // This tells mongoDB to allow null values [No effect. WHY?]
    // for email, which will be filled in later with 'unique' values 
  },
  password: {
    type: String,
    required: true 
  },
  avatar: {
   type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
