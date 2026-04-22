const express = require('express');
const { getCategories, createCategory, getTags, createTag } = require('../controllers/taxonomy.controller');
const { addComment, deleteComment, toggleLike } = require('../controllers/interaction.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Taxonomy
router.get('/categories', getCategories);
router.post('/categories', protect, authorize('ADMIN'), createCategory);
router.get('/tags', getTags);
router.post('/tags', protect, authorize('AUTHOR', 'ADMIN'), createTag);

// Interactions
router.post('/comments', protect, addComment);
router.delete('/comments/:id', protect, deleteComment);
router.post('/likes', protect, toggleLike);

module.exports = router;
