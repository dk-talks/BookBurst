// models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  googleBooksId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: [{
    type: String,
  }],
  description: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  isbn: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['reading', 'finished', 'want-to-read'],
    default: 'want-to-read',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure a user can only have one copy of a book
BookSchema.index({ user: 1, googleBooksId: 1 }, { unique: true });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);