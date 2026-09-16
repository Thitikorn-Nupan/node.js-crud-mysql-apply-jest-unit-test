import router from "./controller/book-control.ts";
import uRouter from "./controller/user-control.ts";
import express , {Express} from "express";
import * as path from 'path';
import {createLogger} from "./log/logging-v2.ts";
import {Logger} from "winston";

//  the ESM-only code: const __filename = fileURLToPath(import.meta.url);
const filename :string  = path.basename(__filename); // with the CommonJS-compatible version:
const log : Logger = createLogger(filename);

const application : Express = express();

application.use('/api.test',uRouter)
application.use('/api', router).listen(3000, function (errors : any) : void {
    if (errors) throw errors
    else log.warning(`u r in port 3000`)
})