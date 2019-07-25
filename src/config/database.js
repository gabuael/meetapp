require('dotenv/config');

module.exports = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
