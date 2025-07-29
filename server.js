require('dotenv').config(); // ✅ Load .env before anything else

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = process.env.PORT || 5000;

// ✅ Check for Mongo URI
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set in .env file');
  process.exit(1);
}
console.log('✅ Loaded MONGO_URI');

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ Schema & Model
const userSchema = new mongoose.Schema({
  title: { type: String, required: true },
  area: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String },
  previewImage: { type: String }
}, { timestamps: true }); // Adds createdAt and updatedAt

const User = mongoose.model('User', userSchema);

// ✅ Root Test Route
app.get('/', (req, res) => {
  res.send('✅ API is working!');
});

// ✅ Save Property Route
app.post('/api/properties', async (req, res) => {
  try {
    console.log('📥 Incoming Data:', req.body); // Debug incoming data

    const userData = new User(req.body);
    const savedUser = await userData.save();

    console.log('✅ Data Saved:', savedUser); // Debug save result
    res.status(201).json({ message: "✅ Data saved successfully", data: savedUser });

  } catch (error) {
    console.error('❌ Error saving data:', error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Fetch All Properties Route
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await User.find();
    console.log('📦 Properties fetched:', properties.length); // Debug number of docs
    res.status(200).json(properties);
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
