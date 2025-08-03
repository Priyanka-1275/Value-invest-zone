const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const propertyRoutes = require('./routes/propertyRoutes'); // 👈 adjust if needed
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/properties', propertyRoutes); // 👈 mounts the routes

// Optional: root route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
