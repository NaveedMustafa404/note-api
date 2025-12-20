import { Sequelize } from "sequelize";
import { initModels } from "../models/index.js";

let sequelize;

export const connectDB = () => {
    if (!sequelize) {
        sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: "mysql",
                logging : false,
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
            }
        );
        initModels(sequelize);

    }
    return sequelize;
            };