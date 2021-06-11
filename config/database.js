import { Sequelize } from "sequelize";

const { PG_URL_DEV, DATABASE_URL } = process.env;

let db;

if (process.env.NODE_ENV === "development") {
  db = new Sequelize(PG_URL_DEV, {
    dialect: "postgres",
  });
} else {
  db = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

try {
  await db.authenticate();
  console.log("Connection to the Database established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default db;
