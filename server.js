const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'your-mongodb-uri-here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Multer setup
const storage = multer.memoryStorage(); // or use diskStorage if needed
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Mongoose schema
const propertySchema = new mongoose.Schema({
  title: String,
  area: String,
  description: String,
  location: String,
  price: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const Property = mongoose.model('Property', propertySchema);

// Routes
app.post('/api/properties', upload.single('image'), async (req, res) => {
  try {
    const { title, area, description, location, price } = req.body;
    const newProperty = new Property({
      title,
      area,
      description,
      location,
      price,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newProperty.save();
    res.status(201).json({ message: 'Property uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching properties' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

