import {book} from "../entities/book.ts";
import {Model} from "sequelize";
import * as path from 'path';
import {createLogger} from "../log/logging-v2.ts";
import {Logger} from "winston";

//  the ESM-only code: const __filename = fileURLToPath(import.meta.url);
const filename :string  = path.basename(__filename); // with the CommonJS-compatible version:
const log : Logger = createLogger(filename);


export const reads = async (): Promise<Model[]> => {
    try {
        const books = await book().findAll()
        if (books.length > 0) {
            return books
        } else {
            log.debug("there are no books in bookstore")
            return books
        }
    } catch (errors) {
        log.warning("somethings was wrong in reads method and cause is " + errors)
        throw errors
    }
}

export const read = async (id: number): Promise<Model | null> => {
    try {
        const bookById = await book().findByPk(id)
        if (bookById) {
            return bookById
        } else {
            log.debug("there are no book in bookstore")
            return bookById
        }
    } catch (errors) {
        log.warning("somethings was wrong in read method and cause is " + errors)
        throw errors
    }
}

export const create = async (name: string, price: number, productiondate: Date): Promise<Model> => {
    try {
        return await book().create({name, price, productiondate})
    } catch (errors) {
        log.warning(`create failed: ${errors}`);
        throw errors
    }
}

export const update = async (name: string, price: number, productiondate: Date, id: number): Promise<number | null> => {
    try {
        const [affectedRows] = await book().update({name, price, productiondate}, {where: {id}});
        if (affectedRows === 0) {
            // throw new Error(`book not found with id ${id}`);
            return 0
        }
        return affectedRows
    } catch (errors) {
        log.warning(`update failed: ${errors}`);
        throw errors
    }
}

export const deleteById = async (id: number) : Promise<number | null> => {
    try {
        const deletedRows = await book().destroy({where: {id},});
        if (deletedRows === 0) {
            // throw new Error(`book not found with id ${id}`);
            return 0
        }
        return deletedRows
    } catch (errors) {
        log.warning(`deleteById failed: ${errors}`);
        throw errors
    }
}
