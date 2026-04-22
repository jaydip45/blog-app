const express = require('express');
const { getPosts, getPostBySlug, createPost, updatePost, deletePost } = require('../controllers/post.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, authorize('AUTHOR', 'ADMIN'), createPost);
router.put('/:id', protect, authorize('AUTHOR', 'ADMIN'), updatePost);
router.delete('/:id', protect, authorize('AUTHOR', 'ADMIN'), deletePost);

module.exports = router;
