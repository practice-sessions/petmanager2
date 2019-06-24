const express = require('express');
const apiRouter = express.Router();
const auth = require('../../../middleware/auth');

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

module.exports = apiRouter;