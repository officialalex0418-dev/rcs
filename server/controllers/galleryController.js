import { GalleryItem, Album } from '../models/Gallery.js';

export const getGalleryItems = async (req, res, next) => {
  try {
    const filters = req.query.admin ? {} : { published: true };
    const items = await GalleryItem.find(filters).populate('album').sort('-createdAt');
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.create({ ...req.body, uploadedBy: req.user.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find().sort('name');
    res.status(200).json({ success: true, data: albums });
  } catch (err) {
    next(err);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).json({ success: true, data: album });
  } catch (err) {
    next(err);
  }
};
