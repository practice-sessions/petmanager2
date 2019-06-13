const express = require('express'); 
const apiRouter = express.Router();
const { check, validationResult } = require('express-validator/check');
//const gravatar = require('gravatar'); 
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../../../models/User');

// @route   POST api/users  
// @desc    Register user
// @access  Public
apiRouter.post(
  '/',  
  // isNumeric() used for contact number for now, 
  //will change to isMobilePhone() later
  [
    check('name', 'Your name is required please')
      .not()
      .isEmpty(),
    check('contactnumber', 'Your contact number is required')
    .isNumeric(),
    check('password', 'Please a password with 4 or more characters')
    .isLength({ min: 4 })
  ],  
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contactnumber, email, password } = req.body;

  try {
  // Check if user does exist
  let user = await User.findOne({contactnumber});

  if(user) {
    return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
  }
    /*
    // Get users gravatar/pix if available
    const avatar = gravatar.url(email, {
      s: '200', // Size default
      r: 'pg', // Rating
      d: 'mm' // Default
    })
    */

    // Create user instance
    user = new User({
      name,
      contactnumber,
      email,
      password
      //avatar 
    })

    // Encrypt password 
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Save user 
    await user.save();

    // Return jsonwebtoken

    res.send('User registered'); 

} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error, something went wrong!');
}

});

module.exports = apiRouter;