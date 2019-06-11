const express = require('express');

const app = express();

// End points
app.get('/', (req, res) => res.send('API connected..'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
});
