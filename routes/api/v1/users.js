const express = require('express'); 
const apiRouter = express.Router();
const { check, validationResult } = require('express-validator/check');
//const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// Load User model
const User = require('../../../models/v1/User');

// @route   POST api/v1/users/register 
// @desc    Register user with auth
// @access  Public
apiRouter.post(
  '/register',  
  // isNumeric() used for contact number for now, 
  //will change to isMobilePhone() later 
  [
    check('name', 'Your name is required please')
      .not()
      .isEmpty(),
    check('contactnumber', 'Your contact number is required')
      .isNumeric(),
    check('email', 'A valid email is required please')
      .isEmail()
      .normalizeEmail(), 
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
      d: 'mm' // Default (hollow image)
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

    // Log in user immediately after sign in, 
    // by returning jsonwebtoken
    const payload = {
      user: {
        id: user.id // Although mongoDB uses _id as ObjectId, 
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
      }); // Note: jwtSecret above is in config file' and
      // 360000 used for expiration (in development), use 3600 in production
  
} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error, something went wrong!');
}

});

// @route   POST api/v1/users/add  
// @desc    Register user without auth - add user 
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
    //check('email', 'A valid email is required please').isEmail() 
  ],  
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contactnumber, email } = req.body;

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
      d: 'mm' // Default (hollow image)
    })
    */

    // Create user instance
    user = new User({
      name,
      contactnumber,
      email
      //avatar
    })

    // Save user 
    await user.save();

    // Log in user immediately after sign in, 
    // by returning jsonwebtoken
    const payload = {
      user: {
        id: user.id // Although mongoDB uses _id as ObjectId, 
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
      }); // Note: jwtSecret above is in config file' and
      // 360000 used for expiration (in development), use 3600 in production
  
} catch(err) {
  console.error(err.message);
  res.status(500).send('Server error, something went wrong!');
}

});

module.exports = apiRouter; 