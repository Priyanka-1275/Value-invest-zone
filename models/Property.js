import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: String,
  area: String,
  description: String,
  location: String,
  price: String,
  image: String, // base64 string
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
