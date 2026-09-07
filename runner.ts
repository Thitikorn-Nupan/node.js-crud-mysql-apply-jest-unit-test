import router from "./controller/book-control";
import logging from "./log/logging";
import express , {Express} from "express";

const application : Express = express();

application.use('/api', router).listen(3000, function (errors : any) : void {
    if (errors) throw errors
    else logging.winston.info(`u r in port 3000`)
})