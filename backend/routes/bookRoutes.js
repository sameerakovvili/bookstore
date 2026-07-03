const express = require('express');
const Book = require('../models/Book');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route  GET /api/books
// Supports ?keyword=&genre=&language=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { keyword, genre, language, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { author: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (genre) filter.genre = genre;
    if (language) filter.language = language;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const count = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.json({
      books,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      total: count,
    });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/books/:id
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/books (admin only)
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/books/:id (admin only)
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/books/:id (admin only)
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed' });
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/books/:id/reviews
router.post('/:id/reviews', protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Book already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating =
      book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
