const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  bookPhotoUpload,
  searchBooks
} = require('../controllers/bookController');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Book = require('../models/Book');

// Re-route into other resource routers
// router.use('/:bookId/exchanges', exchangeRouter);

router
  .route('/')
  .get(
    advancedResults(Book, {
      path: 'seller',
      select: 'name university department'
    }),
    getBooks
  )
  .post(protect, authorize('user', 'admin'), createBook);

router
  .route('/:id')
  .get(getBook)
  .put(protect, authorize('user', 'admin'), updateBook)
  .delete(protect, authorize('user', 'admin'), deleteBook);

router.route('/:id/photo').put(protect, bookPhotoUpload);
router.route('/search').get(searchBooks);

module.exports = router;
