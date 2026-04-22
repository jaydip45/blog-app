const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const addComment = async (req, res) => {
  const { postId, content } = req.body;
  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO comment (id, content, postId, userId) VALUES (?, ?, ?, ?)',
      [id, content, postId, req.user.id]
    );

    const [comments] = await pool.query(`
      SELECT c.*, u.name as userName, u.avatar as userAvatar 
      FROM comment c 
      JOIN user u ON c.userId = u.id 
      WHERE c.id = ?
    `, [id]);

    const comment = comments[0];
    res.status(201).json({
      ...comment,
      user: { name: comment.userName, avatar: comment.userAvatar }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const [comments] = await pool.query('SELECT * FROM comment WHERE id = ?', [id]);
    const comment = comments[0];

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query('DELETE FROM comment WHERE id = ?', [id]);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  const { postId } = req.body;
  try {
    const [likes] = await pool.query(
      'SELECT * FROM `like` WHERE postId = ? AND userId = ?',
      [postId, req.user.id]
    );

    if (likes.length > 0) {
      await pool.query('DELETE FROM `like` WHERE postId = ? AND userId = ?', [postId, req.user.id]);
      return res.json({ liked: false });
    }

    await pool.query(
      'INSERT INTO `like` (id, postId, userId) VALUES (?, ?, ?)',
      [uuidv4(), postId, req.user.id]
    );
    res.json({ liked: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  deleteComment,
  toggleLike
};
