const pool = require('../config/db');
const { createPostSchema, updatePostSchema } = require('../validations/post.validation');
const { v4: uuidv4 } = require('uuid');

const getPosts = async (req, res) => {
  const { page = 1, limit = 10, search, category, tag } = req.query;
  const skip = (page - 1) * limit;

  let query = `
    SELECT p.*, 
           u.name as authorName, u.avatar as authorAvatar,
           c.name as categoryName, c.slug as categorySlug,
           (SELECT COUNT(*) FROM comment WHERE postId = p.id) as commentCount,
           (SELECT COUNT(*) FROM \`like\` WHERE postId = p.id) as likeCount
    FROM post p
    LEFT JOIN user u ON p.authorId = u.id
    LEFT JOIN category c ON p.categoryId = c.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (search) {
    query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += ' AND c.slug = ?';
    queryParams.push(category);
  }

  if (tag) {
    query += ' AND p.id IN (SELECT A FROM _posttotag pt JOIN tag t ON pt.B = t.id WHERE t.slug = ?)';
    queryParams.push(tag);
  }

  query += ' ORDER BY p.createdAt DESC LIMIT ? OFFSET ?';
  queryParams.push(Number(limit), Number(skip));

  try {
    const [posts] = await pool.query(query, queryParams);
    
    let countQuery = 'SELECT COUNT(*) as total FROM post p LEFT JOIN category c ON p.categoryId = c.id WHERE 1=1';
    const countParams = [];
    if (search) { countQuery += ' AND (p.title LIKE ? OR p.content LIKE ?)'; countParams.push(`%${search}%`, `%${search}%`); }
    if (category) { countQuery += ' AND c.slug = ?'; countParams.push(category); }
    
    const [countRes] = await pool.query(countQuery, countParams);
    const total = countRes[0]?.total || 0;

    const formattedPosts = posts.map(p => ({
      ...p,
      author: { name: p.authorName, avatar: p.authorAvatar },
      category: { name: p.categoryName, slug: p.categorySlug },
      _count: { comments: p.commentCount, likes: p.likeCount }
    }));

    res.json({
      posts: formattedPosts,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [posts] = await pool.query(`
      SELECT p.*, 
             u.id as authorId, u.name as authorName, u.avatar as authorAvatar, u.profile as authorProfile,
             c.id as categoryId, c.name as categoryName, c.slug as categorySlug
      FROM post p
      LEFT JOIN user u ON p.authorId = u.id
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.slug = ?
    `, [slug]);

    const post = posts[0];

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const [tags] = await pool.query(`
      SELECT t.id, t.name, t.slug 
      FROM tag t
      JOIN _posttotag pt ON t.id = pt.B
      WHERE pt.A = ?
    `, [post.id]);

    const [comments] = await pool.query(`
      SELECT c.*, u.name as userName, u.avatar as userAvatar
      FROM comment c
      LEFT JOIN user u ON c.userId = u.id
      WHERE c.postId = ?
      ORDER BY c.createdAt DESC
    `, [post.id]);

    await pool.query('UPDATE post SET views = views + 1 WHERE id = ?', [post.id]);

    const formattedPost = {
      ...post,
      author: { id: post.authorId, name: post.authorName, avatar: post.authorAvatar, profile: post.authorProfile },
      category: { id: post.categoryId, name: post.categoryName, slug: post.categorySlug },
      tags,
      comments: comments.map(c => ({
        ...c,
        user: { name: c.userName, avatar: c.userAvatar }
      })),
      _count: { likes: 0 }
    };

    res.json(formattedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    const { title, content, excerpt, coverImage, published, categoryId, tags, primaryKeywords, secondaryKeywords, longTailKeywords } = validatedData;

    const id = uuidv4();
    const slug = title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-') + '-' + Date.now();

    await pool.query(`
      INSERT INTO post (id, title, slug, content, excerpt, primaryKeywords, secondaryKeywords, longTailKeywords, coverImage, published, authorId, categoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [id, title, slug, content, excerpt, primaryKeywords, secondaryKeywords, longTailKeywords, coverImage, published, req.user.id, categoryId]);

    if (tags && tags.length > 0) {
      const tagValues = tags.map(tagId => [id, tagId]);
      await pool.query('INSERT INTO _posttotag (A, B) VALUES ?', [tagValues]);
    }

    res.status(201).json({ id, title, slug });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const [posts] = await pool.query('SELECT * FROM post WHERE id = ?', [id]);
    const post = posts[0];

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const validatedData = updatePostSchema.parse(req.body);
    const { title, content, excerpt, coverImage, published, categoryId, tags, primaryKeywords, secondaryKeywords, longTailKeywords } = validatedData;

    await pool.query(`
      UPDATE post 
      SET title = ?, content = ?, excerpt = ?, primaryKeywords = ?, secondaryKeywords = ?, longTailKeywords = ?, coverImage = ?, published = ?, categoryId = ?, updatedAt = NOW()
      WHERE id = ?
    `, [title, content, excerpt, primaryKeywords, secondaryKeywords, longTailKeywords, coverImage, published, categoryId, id]);

    if (tags) {
      await pool.query('DELETE FROM _posttotag WHERE A = ?', [id]);
      if (tags.length > 0) {
        const tagValues = tags.map(tagId => [id, tagId]);
        await pool.query('INSERT INTO _posttotag (A, B) VALUES ?', [tagValues]);
      }
    }

    res.json({ message: 'Post updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const [posts] = await pool.query('SELECT * FROM post WHERE id = ?', [id]);
    if (posts.length === 0) return res.status(404).json({ message: 'Post not found' });

    if (posts[0].authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query('DELETE FROM post WHERE id = ?', [id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
};
