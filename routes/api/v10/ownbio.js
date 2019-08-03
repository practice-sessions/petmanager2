const express = require('express');
/* Include {mergeParams; true} in file where the nested params reside. 
	mergeParams tells apiRouter to merge parameters that are created on 
	this set of routes with the ones from its parents  
*/
const apiRouter = express.Router({ mergeParams: true });

const auth = require('../../../middleware/auth'); 
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const OwnBio = require('../../../models/v10/OwnBio');
const User = require('../../../models/v1/User');

// @route   GET api/v10/ownbio
// @desc    Tests owners route
// @access  Public
apiRouter.get('/', (req, res) => res.send({ message: 'Owners does work!' }));

// @route   POST api/v10/ownbio 
// @desc    Create or update owner bio data 
// @access  Private
apiRouter.post('/add-owner-bio', 
[ 
  auth, 
  [
    check('vetname', 'Your vets name and number is required')
      .not()
      .isEmpty(),
    check('specialneeds', 
      'Briefly provide any special needs info for your pet, if any please')
      .not()
      .isEmpty()
  ] 
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    vetname, 
    specialneeds 
  } = req.body;

  // Build owner bio object 
  const ownerBioFields = {};

  ownerBioFields.user = req.user.id;

  if(vetname) ownerBioFields.vetname = vetname;
  if(specialneeds) {
    ownerBioFields.specialneeds = specialneeds.split(',').map(specialneed => specialneed.trim());
  }
  
  try {
    let ownbio = await OwnBio.findOne({ user: req.user.id });

    if (ownbio) {
      // Update owner bio 
      ownbio = await OwnBio.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: ownerBioFields },
        { new: true }
      );

      return res.json(ownbio);
    }

    // Create owner bio fields
    ownbio = new OwnBio(ownerBioFields);

    await ownbio.save();

    res.json(ownbio); 

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  } 

});

// @route   GET api/v10/ownbio/named
// @desc    Get current owner's bio data by id 
// @access  Public (for now). Becomes 'Private' once users' signup / login is enabled
apiRouter.get('/named', auth, async (req, res) => {

  try {
    const ownbio = await 
      OwnBio
        .findOne({user: req.user.id})
        .populate('user', ['firstname', 'lastname', 'contactnumber']);// Pull required data from user profile 

        if (!ownbio) {
          return res.status(400).json({msg: 'There is no owner bio data for this user'});
        }

        res.json(ownbio);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
});

// @route   GET api/v10/ownbio/all
// @desc    Get all owners' bio data 
// @access  Public (for now). Becomes 'Private' once users' signup / login is enabled
apiRouter.get('/all', async (req, res) => {
  try {
    const ownbio = await OwnBio.find().populate('user', ['firstname', 'lastname', 'contactnumber', 'avatar']);
    res.json(ownbio);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error, something went wrong!');
  }
});


module.exports = apiRouter; 