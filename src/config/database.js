module.exports = {
  dialect: 'mysql',
  host: 'localhost',
  port: 42333,
  username: 'meetuser',
  password: 'meetuser@1234',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
