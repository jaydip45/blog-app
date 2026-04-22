const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, (SELECT COUNT(*) FROM post WHERE categoryId = c.id) as postCount 
      FROM category c
    `);
    res.json(categories.map(c => ({ ...c, _count: { posts: c.postCount } })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\\w-]+/g, '');
  try {
    await pool.query('INSERT INTO category (id, name, slug) VALUES (?, ?, ?)', [id, name, slug]);
    res.status(201).json({ id, name, slug });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tags
const getTags = async (req, res) => {
  try {
    const [tags] = await pool.query(`
      SELECT t.*, (SELECT COUNT(*) FROM _posttotag WHERE B = t.id) as postCount 
      FROM tag t
    `);
    res.json(tags.map(t => ({ ...t, _count: { posts: t.postCount } })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTag = async (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\\w-]+/g, '');
  try {
    await pool.query('INSERT INTO tag (id, name, slug) VALUES (?, ?, ?)', [id, name, slug]);
    res.status(201).json({ id, name, slug });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  getTags,
  createTag
};
