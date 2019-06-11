const express = require('express'); 
const apiRouter = express.Router();

// @route   GET api/users  
// @desc    Tests users route
// @access   Public
apiRouter.get('/', (req, res) => res.send({ message: 'Users do work!' }));

module.exports = apiRouter;