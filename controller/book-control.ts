import logging from "../log/logging";
import bodyParser  from "body-parser";
import express, {Request, Response, Router} from "express"
import {reads, read, create, update, deleteById} from "../services/book-service";
import {Model} from "sequelize";

const router: Router = express.Router()

// set middleware for create,update (sent http body)
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

// set api
router.get('/reads', async (req : Request, res: Response): Promise<any> => {
    try {
        await reads().then((books: Model<any>[]) => {
            return res
                .status(202)
                .json(responseJson("accepted", books))
        })
    } catch (errors: unknown) {
        if (errors instanceof Error) {
            logging.winston.warn(`course : ${errors.message}`)
        }
        throw errors
    }
})

router.get('/read', async (req : Request, res: Response): Promise<any> => {
    try {
        const id: any = req.query.id;
        if (id) {
            await read(id).then((book: Model<any> | null) => {
                return res
                    .status(202)
                    .json(responseJson("accepted", book))
            })
        } else {
            return res
                .status(202)
                .json(responseJson("accepted", "not found id"))
        }

    } catch (errors: unknown) {
        if (errors instanceof Error) {
            logging.winston.warn(`course : ${errors.message}`)
        }
        throw errors
    }
})

router.post('/create', async (req : Request, res: Response): Promise<any> => {
    try {
        const {name, price} = req.body
        const productiondate = new Date(Date.now())
        if (name && price) {
            await create(name,price,productiondate).then((book: Model<any> | null) => {
                return res
                    .status(202)
                    .json(responseJson("accepted", book))
            })
        } else {
            return res
                .status(202)
                .json(responseJson("accepted", "some these name && price doesn't exist"))
        }

    } catch (errors: unknown) {
        if (errors instanceof Error) {
            logging.winston.warn(`course : ${errors.message}`)
        }
        throw errors
    }
})

router.put('/update', async (req : Request, res: Response): Promise<any> => {
    try {
        const id: any = req.query.id;
        const {name, price} = req.body
        const productiondate = new Date(Date.now())
        if (name && price && id) {
            await update(name,price,productiondate,id).then((rowAffected: number | null) => {
                return res
                    .status(202)
                    .json(responseJson("accepted", rowAffected))
            })
        } else {
            return res
                .status(202)
                .json(responseJson("accepted", "some these name && price && id doesn't exist"))
        }

    } catch (errors: unknown) {
        if (errors instanceof Error) {
            logging.winston.warn(`course : ${errors.message}`)
        }
        throw errors
    }
})

router.delete('/delete', async (req : Request, res: Response): Promise<any> => {
    try {
        const id: any = req.query.id;
        if (id) {
            await deleteById(id).then((rowAffected: number | null) => {
                return res
                    .status(202)
                    .json(responseJson("accepted", rowAffected))
            })
        } else {
            return res
                .status(202)
                .json(responseJson("accepted", "delete failed"))
        }

    } catch (errors: unknown) {
        if (errors instanceof Error) {
            logging.winston.warn(`course : ${errors.message}`)
        }
        throw errors
    }
})

const responseJson = (statusString: string, responseData: any): { status: string, response: any } => {
    return {
        status: statusString,
        response: responseData
    }
}

export default router;