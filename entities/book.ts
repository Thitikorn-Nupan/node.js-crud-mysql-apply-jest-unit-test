import {dbConfig} from "../configuration/dbconfig"
import {INTEGER, STRING, DECIMAL, DATE, ModelCtor, Model} from "sequelize";
import logging from "../log/logging";

export const book = () : ModelCtor<Model> => {
    return dbConfig().define("books_2", {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: STRING
            },
            price: {
                type: DECIMAL
            }
            ,
            productiondate: {
                type: DATE
            }
        },
        {
            // freeze name table not using *s on name
            freezeTableName: true,
            // don't use createdAt/update
            timestamps: false
        })
}

