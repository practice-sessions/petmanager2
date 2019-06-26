const express = require('express');
const apiRouter = express.Router();

const auth = require('../../../middleware/auth'); 

const User = require('../../../models/User');
const Owner = require('../../../models/Owner');

// @route   GET api/v1/owner 
// @desc    Tests owners route
// @access   Public
apiRouter.get('/', (req, res) => res.send({ message: 'Owners does work!' }));

// @route   GET api/v1/owner/bio 
// @desc    Get current owner's bio data
// @access   Public (for now). Becomes 'Private' once users signup / login is enabled
apiRouter.get('/bio', auth, async (req, res) => {

  try {
    const owner = await 
      Owner
        .findOne({user: req.user.id})
        .populate('user', ['name', 'contactnumber']);// Pull required data from user profile 

        if (!owner) {
          return res.status(400).json({msg: 'There is no owner bio data for this user'});
        }

        res.json(owner);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
}); 

module.exports = apiRouter;