import * as dotenv from 'dotenv';
import {Sequelize} from "sequelize";
import * as path from 'path';
import {createLogger} from "../log/logging-v2.ts";
import {Logger} from "winston";

const filename :string  = path.basename(__filename);
const log : Logger = createLogger(filename);

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
dbConfig()
    .authenticate()
    .then(() => {
        log.info('Connection has been established successfully.');
    })
    .catch(err => {
        log.debug(`Unable to connect to the database: ${err}`);
        throw err
    });
*/

