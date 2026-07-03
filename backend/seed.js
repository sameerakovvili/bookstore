// Run with: node seed.js
// Seeds the database with sample books and an admin user.
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Book = require('./models/Book');
const User = require('./models/User');

dotenv.config();
connectDB();

const sampleBooks = [
  {
    title: 'The Silent Forest',
    author: 'Amara Ellis',
    description: 'A haunting tale of mystery set deep within an ancient forest.',
    genre: 'Fiction',
    language: 'English',
    price: 12.99,
    stock: 25,
    coverImage: '',
  },
  {
    title: 'Codebreakers',
    author: 'Ravi Sharma',
    description: 'An introduction to cryptography and its role in modern computing.',
    genre: 'Non-Fiction',
    language: 'English',
    price: 18.5,
    stock: 15,
    coverImage: '',
  },
  {
    title: 'Whispers of Time',
    author: 'Elena Cruz',
    description: 'A sweeping historical saga spanning three generations.',
    genre: 'Historical',
    language: 'English',
    price: 15.0,
    stock: 30,
    coverImage: '',
  },
];

const importData = async () => {
  try {
    await Book.deleteMany();
    await Book.insertMany(sampleBooks);

    const adminExists = await User.findOne({ email: 'admin@bookstore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@bookstore.com',
        password: 'admin123',
        role: 'admin',
      });
    }

    console.log('Sample data imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
