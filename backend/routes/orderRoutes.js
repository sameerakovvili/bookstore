const express = require('express');
const Order = require('../models/Order');
const Book = require('../models/Book');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route  POST /api/orders
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.book}` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      }
      totalPrice += book.price * item.quantity;
      orderItems.push({
        book: book._id,
        title: book.title,
        quantity: item.quantity,
        price: book.price,
      });
      book.stock -= item.quantity;
      await book.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders/my
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/orders (admin only)
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/orders/:id/status (admin only)
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
