const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  name: {
    type: String,
    required: true
  },
  contactnumbers: {
    type: Number,
    required: 'Your contact number is required please',
    unique: true
  },
  // confirmContactnumber: {
	// 	type: Number,
	// 	required: 'Confirm contact number please' 
	// },
  email: {
    type: String
    /*,
    //required: true, 
    unique: true,
    partial: true // This should tell mongoDB to allow null values for email,
    // which will be filled in later with 'unique' values [But. No effect. WHY?] 
    */
  },
  /*
  password: {
    type: String,
   // required: true 
  },
  */ 
  avatar: {
   type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Client = mongoose.model('client', ClientSchema);
