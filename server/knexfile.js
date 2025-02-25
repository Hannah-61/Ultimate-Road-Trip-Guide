require("dotenv").config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "Kiymetlimiz.61", 
      database: "newplacedb"
    },
    migrations: { directory: "./migrations" },
    seeds: { directory: "./seeds" }
  }
};
