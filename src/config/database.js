const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("devtinder", "dev", "dev", {
  host: "localhost",
  dialect: "postgres",
});
module.exports = sequelize;
// This code sets up a Sequelize instance to connect to a PostgreSQL database named "devtinder"