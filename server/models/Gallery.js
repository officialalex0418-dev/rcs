import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true
  },
  storageKey: String,
  thumbnailUrl: String,
  category: String,
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  altText: String,
  caption: String,
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: String,
  coverImage: String,
  category: String,
  status: {
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active'
  }
}, {
  timestamps: true
});

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export const Album = mongoose.model('Album', albumSchema);
