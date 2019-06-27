const express = require('express');
const apiRouter = express.Router();
const auth = require('../../../middleware/auth');
//const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const PetOwner = require('../../../models/v2/PetOwner');

// @route   GET api/v2/auth2
// @desc    Get pet owner route, for use where auth is not enabled
// @access  Public 
apiRouter.get('/', auth, async (req, res) => {
  try {
    const pet_owner = await PetOwner.findOne(req.body.contactnumber);
    if(!pet_owner) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid pet owner details!' }] });
    }

    res.json(pet_owner); 
    
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error!!');
  }
});



module.exports = apiRouter; 