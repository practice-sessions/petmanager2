const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema - "ClientBio" == pet owner bio
const ClientBioSchema = new Schema({
	client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'client'
  },
  contactnumbers: {
		type: [Number],
		required: 'Confirm contact number please' 
  },
  address: [
		{
			house: {
				type: String,
				//required: 'A house name or street number is required please' 
      },
      street: {
				type: String,
				//required: 'A street name is required please'
      }, 
      street2: {
        type: String
      },
      postcode: {
				type: String,
				//required: 'A postcode is required please'
      },
      city: {
				type: String,
				//required: 'A town or city name is required please'
      },
		}
  ],
	pets: [
		{
			// Array allows possibility of more than one pet 
			type: Schema.Types.ObjectId,
			ref: 'pet'
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
});
 
module.exports = ClientBio = mongoose.model('client_bio', ClientBioSchema); 