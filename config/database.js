import { Sequelize } from "sequelize";

let connectionString;

const { PG_URL_DEV, DATABASE_URL } = process.env;

if (process.env.NODE_ENV === "development") {
  connectionString = PG_URL_DEV;
} else {
  connectionString = DATABASE_URL;
}

const db = new Sequelize(`${connectionString}?sslmode=require`, {
  dialect: "postgres",
  native: true,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },

try {
  await db.authenticate();
  console.log("Connection to the Database established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default db;
