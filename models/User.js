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
    unique: true,
    index: true,
    partial: true // This should tell mongoDB to allow null values for email,
    // which will be filled in later with 'unique' values [But. No effect. WHY?]
  },
  
  password: {
    type: String,
   // required: true 
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
