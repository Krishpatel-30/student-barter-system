const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter book title'],
    trim: true,
    maxlength: [100, 'Book title cannot exceed 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please enter author name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter book description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
    maxlength: [5, 'Price cannot exceed 5 characters'],
    default: 0.0
  },
  condition: {
    type: String,
    required: [true, 'Please select condition for this book'],
    enum: {
      values: [
        'New',
        'Like New',
        'Good',
        'Fair',
        'Poor'
      ],
      message: 'Please select correct condition for book'
    }
  },
  category: {
    type: String,
    required: [true, 'Please select category for this book'],
    enum: {
      values: [
        'Textbooks',
        'Novels',
        'Academic',
        'Reference',
        'Non-Fiction',
        'Others'
      ],
      message: 'Please select correct category for book'
    }
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'traded'],
    default: 'available'
  },
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for text search
bookSchema.index({ 
  title: 'text',
  author: 'text',
  description: 'text',
  category: 'text'
});

module.exports = mongoose.model('Book', bookSchema);
