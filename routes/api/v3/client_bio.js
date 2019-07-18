const express = require('express');
/* Include {mergeParams; true} in file where the nested params reside. 
	mergeParams tells apiRouter to merge parameters that are created on 
	this set of routes with the ones from its parents  
*/
const apiRouter = express.Router({ mergeParams: true });

//const auth = require('../../../middleware/auth');  
const { check, validationResult } = require('express-validator');

const Client = require('../../../models/v3/Client');
const ClientBio = require('../../../models/v3/ClientBio');

// @route   GET api/v3/client_bio
// @desc    Tests client bio route
// @access  Public
apiRouter.get('/', (req, res) => res.send({ message: 'Client does work!' }));


// @route   POST api/v3/client_bio/add 
// @desc    Add pet client bio without auth - (Admin add pet client bio)  
// @access  Public
apiRouter.post(
  '/add',  
  // isNumeric() used for contact number for now, 
  //will change to isMobilePhone() later
  [
    check('name', 'Your name is required please')
      .not()
      .isEmpty(),
    //check('email', 'A valid email is required please').isEmail(), 
    check('contactnumbers', 'Confirm your contact number please')
      .isNumeric() 
  ],  
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contactnumbers, email } = req.body;

  try {
  // Check if client bio does exist
  let client_bio = await ClientBio.findOne({contactnumbers});

  if(client_bio) {
    return res.status(400).json({ errors: [{ msg: 'Client bio already exists' }] });
  }
    /*
    // Get clients gravatar/pix if available
    const avatar = gravatar.url(email, {
      s: '200', // Size default 
      r: 'pg', // Rating
      d: 'mm' // Default (hollow image)
    })
    */

    // Create client bio instance
    client_bio = new ClientBio({
      name,
      contactnumber,
      email
      //avatar
    })

    // Save client bio 
    await client_bio.save();
    return res.json(client_bio);
{/*
    // Log into client bio dashboard immediately after sign in, 
    // by returning jsonwebtoken
    const payload = {
      client_bio: {
        id: client_bio.id // Although mongoDB uses _id as ObjectId, 
                    // mongoose allows us use just id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }); // Note: jwtSecret above is in config file' and 360000 used
         //  for expiration (in development), use 3600 in production
    */}
   
} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error, something went wrong!');
}

});


// @route   GET api/v3/client_bio/named
// @desc    Get named client bio by id
// @access  Public (for now). Becomes 'Private' once users' signup / login is enabled
apiRouter.get('/named', async (req, res) => {

  try {
    const client_bio = await 
      ClientBio
        .findOne({client: req.client.id})
        // Pull required data from client bio 
        .populate('client', ['name', 'email', 'contactnumber']);// Pull required data from client bio 

        if (!client_bio) {
          return res.status(400).json({msg: 'There is no bio data for this client'});
        }

        res.json(client_bio);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
}); 

// @route   POST api/v3/client_bio 
// @desc    Create or update client bio data
// @access  Private
apiRouter.post('/', 
[
    check('contactnumbers', 'Enter clients contact number please')
      .isNumeric()
      /*
      ,
    check('address', 'Address information is required')
      .not()
      .isEmpty()
      */ 
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { contactnumbers, address, pets } = req.body;
  
  // Build client bio object 
  const clientBioFields = {};

  clientBioFields.client = req.client.id;
  if(contactnumbers) clientBioFields.contactnumbers = contactnumbers;
  if(pets) clientBioFields.pets = pets;
  if(address) clientBioFields.address = address; 
/* 
  if(address) {
    clientBioFields.address = address.split(',').map(address => address.trim());
  }
*/  
  try {
    let client_bio = await ClientBio.findOne({ client: req.client.id });

    if(client_bio) {
      // Update client bio
      client_bio = await ClientBio.findOneAndUpdate(
        { client: req.client.id }, 
        { $set: clientBioFields },
        { new: true }
      );

      return res.json(client_bio);
    }

    // Create  
    client_bio = new ClientBio(clientBioFields);
    
    await client_bio.save();
    res.json(client_bio);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }

}); 

module.exports = apiRouter;