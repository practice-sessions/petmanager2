const express = require('express'); 
const apiRouter = express.Router();
const { check, validationResult } = require('express-validator/check');

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
    .isNumeric()
    .not()
    .isLength({ min: 4 })
  ], 
  (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('Users do work!');
});

module.exports = apiRouter;