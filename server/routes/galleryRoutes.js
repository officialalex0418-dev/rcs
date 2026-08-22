import express from 'express';
import {
  getGalleryItems, createGalleryItem,
  getAlbums, createAlbum
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/items', getGalleryItems);
router.get('/albums', getAlbums);

// Protected routes
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'));

router.post('/items', createGalleryItem);
router.post('/albums', createAlbum);

export default router;
