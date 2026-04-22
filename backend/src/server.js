const app = require('./app');
const initDb = require('./config/initDb');

const PORT = process.env.PORT || 5000;

// Initialize Database
initDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
