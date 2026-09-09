import bodyParser from "body-parser";
import express, {Request, Response, Router} from "express";
import {UserService} from "../services/user-service";

const uRouter: Router = express.Router();
const userService = new UserService();

// Set middleware for create and update request bodies.
uRouter.use(bodyParser.json());
uRouter.use(bodyParser.urlencoded({extended: true}));

uRouter.get("/reads", (req: Request, res: Response) => {
    return res
        .status(202)
        .json(responseJson("accepted", userService.reads()));
});

uRouter.get("/read", (req: Request, res: Response) => {
    const id = parseId(req.query.id);
    if (id === undefined) {
        return res
            .status(202)
            .json(responseJson("accepted", "not found id"));
    }

    return res
        .status(202)
        .json(responseJson("accepted", userService.read(id)));
});

uRouter.post("/create", (req: Request, res: Response) => {
    const {email, password} = req.body as {
        email?: unknown;
        password?: unknown;
    };

    if (typeof email !== "string" || typeof password !== "string") {
        return res
            .status(202)
            .json(responseJson("accepted", "email && password doesn't exist"));
    }

    return res
        .status(202)
        .json(responseJson("accepted", userService.create({email, password})));
});

uRouter.put("/update", (req: Request, res: Response) => {
    const id = parseId(req.query.id);
    const {email, password} = req.body as {
        email?: unknown;
        password?: unknown;
    };

    if (id === undefined || (email !== undefined && typeof email !== "string")
        || (password !== undefined && typeof password !== "string")) {
        return res
            .status(202)
            .json(responseJson("accepted", "some these email && password && id doesn't exist"));
    }

    const user = userService.update(id, {
        ...(email === undefined ? {} : {email}),
        ...(password === undefined ? {} : {password}),
    });

    return res
        .status(202)
        .json(responseJson("accepted", user));
});

uRouter.delete("/delete", (req: Request, res: Response) => {
    const id = parseId(req.query.id);
    if (id === undefined) {
        return res
            .status(202)
            .json(responseJson("accepted", "delete failed"));
    }
    return res
        .status(202)
        .json(responseJson("accepted", userService.delete(id)));
});

const parseId = (value: unknown): number | undefined => {
    if (typeof value !== "string" || value.trim() === "") {
        return undefined;
    }
    const id = Number(value);
    return Number.isInteger(id) ? id : undefined;
};

const responseJson = (statusString: string, responseData: unknown): {
    status: string;
    response: unknown;
} => ({
    status: statusString,
    response: responseData,
});

export default uRouter;
