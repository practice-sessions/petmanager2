const express = require('express');
const apiRouter = express.Router();

// @route   GET api/owners
// @desc    Tests owners route
// @access   Public
apiRouter.get('/', (req, res) => res.send({ message: 'Owners does work!' }));

module.exports = apiRouter;