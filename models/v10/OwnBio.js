const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema - "OwnBio" == pet owner bio
const OwnBioSchema = new Schema({
	user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  contactnumber: {
		type: [Number],
		required: true 
  },
  address: [
		{
			house: {
				type: String,
				required: 'A house name or street number is required please' 
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
				required: 'A postcode is required please' 
      },
      city: {
				type: String,
				required: 'A town or city name is required please' 
      },
		}
	],
	specialneeds: {
		type: [String],
		required: true 
	},
	vetname: {
		type: String,
		required: true
	},
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

/*
// findByContactnumber method 
// - note: this would be defined/declared in the document (not necessarily here)
OwnBioSchema.methods.findByContactnumber = function (contactnumber) {
  return this.model('OwnBioSchema').find({ contactnumber: this.contactnumber }, contactnumber);
}; 

// findByContactnumber static
OwnBioSchema.static('findByContactnumber', function(contactnumber) {
  return this.find({ contactnumber }); 
});
*/ 
 
module.exports = OwnBio = mongoose.model('ownbio', OwnBioSchema); 