const app = require('./app');
const initDb = require('./config/initDb');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize Database
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

