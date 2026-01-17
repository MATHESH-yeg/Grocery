
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
export default function handler(req, res) {
  res.status(200).json({
    status: "API WORKS"
  });
}
