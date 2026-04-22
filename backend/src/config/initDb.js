const pool = require('./db');

const initDb = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Verifying database tables and columns...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('USER', 'AUTHOR', 'ADMIN') DEFAULT 'USER',
        profile TEXT,
        avatar VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS category (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tag (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS post (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        coverImage VARCHAR(255),
        published BOOLEAN DEFAULT FALSE,
        views INT DEFAULT 0,
        authorId VARCHAR(36),
        categoryId VARCHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE SET NULL
      )
    `);

    // Force add columns using try-catch to ignore if they already exist
    const addCol = async (col, def) => {
      try {
        await connection.query(`ALTER TABLE post ADD COLUMN ${col} ${def}`);
        console.log(`Added column: ${col}`);
      } catch (err) {
        // Ignore if column already exists (Error 1060)
        if (err.errno !== 1060) throw err;
      }
    };

    await addCol('primaryKeywords', 'VARCHAR(255)');
    await addCol('secondaryKeywords', 'VARCHAR(500)');
    await addCol('longTailKeywords', 'TEXT');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS _posttotag (
        A VARCHAR(36),
        B VARCHAR(36),
        PRIMARY KEY (A, B),
        FOREIGN KEY (A) REFERENCES post(id) ON DELETE CASCADE,
        FOREIGN KEY (B) REFERENCES tag(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS comment (
        id VARCHAR(36) PRIMARY KEY,
        content TEXT NOT NULL,
        postId VARCHAR(36),
        userId VARCHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES post(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`like\` (
        id VARCHAR(36) PRIMARY KEY,
        postId VARCHAR(36),
        userId VARCHAR(36),
        UNIQUE KEY post_user (postId, userId),
        FOREIGN KEY (postId) REFERENCES post(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables and columns verified.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    connection.release();
  }
};

module.exports = initDb;
