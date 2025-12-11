const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate({
    path: 'seller',
    select: 'name email university department'
  });

  if (!book) {
    return next(
      new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Create new book
// @route   POST /api/books
// @access  Private
exports.createBook = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.seller = req.user.id;

  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    data: book
  });
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is book owner or admin
  if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this book`,
        401
      )
    );
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: book });
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is book owner or admin
  if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this book`,
        401
      )
    );
  }

  await book.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload photo for book
// @route   PUT /api/books/:id/photo
// @access  Private
exports.bookPhotoUpload = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is book owner or admin
  if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this book`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${book._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Book.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = asyncHandler(async (req, res, next) => {
  const searchQuery = req.query.q;
  
  if (!searchQuery) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const books = await Book.find(
    { $text: { $search: searchQuery } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});
