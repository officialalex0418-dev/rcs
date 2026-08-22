import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rcs_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gallery', galleryRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'RCS Management API is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
