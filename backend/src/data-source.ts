import "reflect-metadata";
import { DataSource } from "typeorm";

const isCompiled = __filename.endsWith(".js");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [isCompiled ? "build/entities/**/*.js" : "src/entities/**/*.ts"],
  migrations: [
    isCompiled ? "build/migrations/**/*.js" : "src/migrations/**/*.ts",
  ],
  ssl: false,

});
