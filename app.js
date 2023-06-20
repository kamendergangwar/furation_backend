const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const winston = require('winston');

const itemRoutes = require('./routes/itemRoutes');
const errorHandlingMiddleware = require('./middleware/errorHandling');

// Set up Express.js app
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/items', itemRoutes);

// Error handling middleware
app.use(errorHandlingMiddleware);

// MongoDB connection
 mongoose.connect('mongodb+srv://kamendersinghgangwar:Engineer@319@cluster0.rstfi9y.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successfully connecting to the database
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
