import { DataSource } from "typeorm";

export const DBDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: ["dist/**/*.entity.js"],
  logging: true,
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
