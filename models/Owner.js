const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema - "Owner" == pet owner  
const OwnerSchema = new Schema({
	user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
	address: [
		{
			house: {
        type: String
      },
      street: {
        type: String
      }, 
      street2: {
        type: String
      },
      postcode: {
        type: String
      },
      city: {
        type: String
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
	email: {
		type: String
	},
	password: {
		type: String
	},
	avatar: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
}); 
 
module.exports = Owner = mongoose.model('owner', OwnerSchema);