const express = require('express'); 
const apiRouter = express.Router();
const mongoose = require('mongoose'); 
const { check, validationResult } = require('express-validator');
//const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs'); 
// const jwt = require('jsonwebtoken');
// const config = require('config');

// Load Client model
const Client = require('../../../models/v3/Client'); 

/*
// @route   GET api/v3/clients/add  
// @desc    Show register client without auth FORM - (Admin add client) 
// @access  Public
apiRouter.get('/add', 
// isNumeric() used for contact number for now, 
  //will change to isMobilePhone() later
  [
    check('name', 'Your name is required please')
      .not()
      .isEmpty(),
    check('contactnumber', 'Your contact number is required')
    .isNumeric(),
    //check('email', 'A valid email is required please').isEmail().normalizeEmail() 
  ],  
  (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
});
*/

// @route   POST api/v3/clients/add  
// @desc    Register client without auth - (Admin add client) 
// @access  Public
apiRouter.post(
  '/add',  
  // isNumeric() used for contact number for now, 
  //will change to isMobilePhone() later
  [
    check('name', 'Your name is required please')
      .not()
      .isEmpty(),
    check('contactnumber', 'Your contact number is required')
    .isNumeric(),
    //check('email', 'A valid email is required please').isEmail().normalizeEmail() 
  ],  
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contactnumber, email } = req.body;

  try {
  // Check if client does exist
  let client = await Client.findOne({contactnumber});

  if(client) {
    // Pull error msg from errors() array declared above
    return res.status(400).json({ errors: [{ msg: 'Client already exists' }] });
  }
    /*
    // Get clients gravatar/pix if available
    const avatar = gravatar.url(email, {
      s: '200', // Size default 
      r: 'pg', // Rating
      d: 'mm' // Default (hollow image)
    })
    */

    // Create client instance 
    client = new Client({
      // Id used as an internally generated (unique) key 
      _id: mongoose.Types.ObjectId(),
      name,
      contactnumber,
      email
      //avatar 
  
  /*
    await Client.insert({
      // Id used as an internally generated (unique) key 
      _id: mongoose.Types.ObjectId(),
      name,
      contactnumber,
      email
      //avatar
  */   
    
    })

    // Save client 
    await client.save();
    return res.json(client); 
    //console.log(client);
    // Redirect to either client list page, or client register form
    //res.redirect('/clients')

   // OR

   // res.render('clients/add')
      
} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error, something went wrong!');
}

});
 
module.exports = apiRouter;