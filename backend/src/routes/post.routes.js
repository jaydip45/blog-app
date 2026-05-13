const express = require('express');
const { getPosts, getPostBySlug, recordPostView, getPostViews, createPost, updatePost, deletePost } = require('../controllers/post.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getPosts);
router.get('/by-id/:id/views', protect, authorize('AUTHOR', 'ADMIN'), getPostViews);
router.post('/:slug/view', recordPostView);
router.get('/:slug', getPostBySlug);
router.post('/', protect, authorize('AUTHOR', 'ADMIN'), createPost);
router.put('/:id', protect, authorize('AUTHOR', 'ADMIN'), updatePost);
router.delete('/:id', protect, authorize('AUTHOR', 'ADMIN'), deletePost);

module.exports = router;
