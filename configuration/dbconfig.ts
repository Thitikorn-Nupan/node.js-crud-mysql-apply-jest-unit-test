import * as dotenv from 'dotenv';
import * as path from 'path';
import {Sequelize} from "sequelize";
// import logging from "../log/logging";

dotenv.config({path: path.resolve('env/.env'), debug: true});

export const dbConfig = () : Sequelize => {
    return new Sequelize(
        process.env.SQLL_DATABASE!,
        process.env.SQLL_USERNAME!,
        process.env.SQLL_PASSWORD,
        {
            // set port & host in this block
            dialect: "mysql",
            host: process.env.SQLL_HOST,
            port: Number(process.env.SQLL_PORT),
        }
    ) // ended return
}

/**
new DBConfig()
    .connect
    .authenticate()
    .then(() => {
        logging.winston.info('Connection has been established successfully.');
    })
    .catch(err => {
        logging.winston.debug('Unable to connect to the database:', err);
        throw err
    });
 */


