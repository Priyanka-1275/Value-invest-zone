const express = require('express');
const router = express.Router();
const multer = require('multer');
const Property = require('../models/Property'); // Path to your schema

// Multer config to handle image uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload a property
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, area, description, location, price } = req.body;
    const image = req.file ? req.file.buffer.toString('base64') : null;

    const newProperty = new Property({
      title,
      area,
      description,
      location,
      price,
      image,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET route to fetch all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

module.exports = router;
