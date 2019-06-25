const express = require('express');
const apiRouter = express.Router();
const auth = require('../../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../../models/User');

// @route   GET api/auth
// @desc    Tests auth route
// @access   Public 
apiRouter.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth  
// @desc    Authenticate user with password, get token
// @access  Public
apiRouter.post(
  '/',  
  // isNumeric() used for contact number for now, 
  //will change to isMobilePhone() later
  [
    check('contactnumber', 'Your contact number is required')
    .isNumeric(),
    //check('email', 'A valid email is required please').isEmail(),
    check('password', 'Password is required please')
    .exists()
  ], 
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { contactnumber, password } = req.body;

  try {
  // Check if user does exist 
  let user = await User.findOne({contactnumber});

  if(!user) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid user details!' }] });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid user details!' }] });
  }
   
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