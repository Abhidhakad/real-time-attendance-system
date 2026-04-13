
import mongoose from 'mongoose';

export default function verifyMongoId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid ID');
    error.statusCode = 400;
    throw error;
  }
}