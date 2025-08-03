const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support large JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster.mongodb.net/propertyDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.error('MongoDB connection error ❌', err));

// Routes
const propertyRoutes = require('./routes/propertyRoutes');
app.use('/api/properties', propertyRoutes);

// Default root route (optional)
app.get('/', (req, res) => {
  res.send('Server is up and running 🟢');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🚀`);
});

