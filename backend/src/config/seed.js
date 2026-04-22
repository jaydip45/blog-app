const pool = require('./db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('Seeding data with updated author credentials...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('gadhavijaydip45', 10);
    const authorPassword = await bcrypt.hash('gadhavijaydip45', 10);

    const adminId = uuidv4();
    const authorId = uuidv4();

    // Admin
    await connection.query(`
      INSERT IGNORE INTO user (id, name, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `, [adminId, 'Admin User', 'gadhavijaydip45@gmail.com', adminPassword, 'ADMIN']);

    // Updated Author
    await connection.query(`
      INSERT IGNORE INTO user (id, name, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `, [authorId, 'jaydip Gadhavi', 'gadhavijaydip45@gmail.com', authorPassword, 'AUTHOR']);

    // Categories
    const cricketId = uuidv4();
    const techId = uuidv4();
    await connection.query('INSERT IGNORE INTO category (id, name, slug) VALUES (?, ?, ?)', [cricketId, 'Cricket', 'cricket']);
    await connection.query('INSERT IGNORE INTO category (id, name, slug) VALUES (?, ?, ?)', [techId, 'Technology', 'technology']);

    // Tags
    const iplId = uuidv4();
    await connection.query('INSERT IGNORE INTO tag (id, name, slug) VALUES (?, ?, ?)', [iplId, 'IPL', 'ipl']);

    // Posts
    const postId = uuidv4();
    await connection.query(`
      INSERT IGNORE INTO post (id, title, slug, content, published, authorId, categoryId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [postId, 'The Evolution of Cricket', 'evolution-of-cricket', 'Cricket has evolved significantly over the years...', 1, authorId, cricketId]);

    // Post Tags
    await connection.query('INSERT IGNORE INTO _posttotag (A, B) VALUES (?, ?)', [postId, iplId]);

    console.log('Seed data created successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    connection.release();
  }
}

module.exports = seed;
