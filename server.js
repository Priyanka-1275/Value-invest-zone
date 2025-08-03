import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import Property from './models/Property.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // handles JSON data
app.use(express.urlencoded({ extended: true })); // handles form data

// Image upload with multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Routes
app.post('/api/properties', upload.single('image'), async (req, res) => {
  try {
    const { title, area, description, location, price } = req.body;
    const imageBuffer = req.file ? req.file.buffer.toString('base64') : '';

    const newProperty = new Property({
      title,
      area,
      description,
      location,
      price,
      image: imageBuffer,
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving property' });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching properties' });
  }
});

// Default fallback
app.get('/', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
