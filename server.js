require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ PORT
const PORT = process.env.PORT || 5000;

// ✅ MongoDB URI check
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env file!');
  process.exit(1);
}

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ Schema
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String },
  previewImage: { type: String }, // base64 string or image URL
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('✅ Backend is live!');
});

// ✅ Upload Route
app.post('/api/properties', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Received:', data);

    const newProperty = new Property(data);
    const saved = await newProperty.save();

    res.status(201).json({ message: '✅ Property uploaded', data: saved });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// ✅ Get All Properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
