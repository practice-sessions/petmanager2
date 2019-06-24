const express = require('express');
const connectDB = require('./config/db'); 

const app = express();

// Connect Database 
connectDB();

// Initialise middleware
app.use(express.json({ extended: false })); 

// End points
app.get('/', (req, res) => res.send('API connected..'));

// Define Routes
app.use('/api/v1/auth', require('./routes/api/v1/auth'));
app.use('/api/v1/users', require('./routes/api/v1/users'));
app.use('/api/v1/owner', require('./routes/api/v1/owner'));
app.use('/api/v1/pet', require('./routes/api/v1/pet'));
app.use('/api/v1/todos', require('./routes/api/v1/todos'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
});
