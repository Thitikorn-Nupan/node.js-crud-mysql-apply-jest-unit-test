import {describe, expect, jest, test} from "@jest/globals";
import router from "../controller/user-control";

type RouteMethod = "get" | "post" | "put" | "delete";
type RequestData = {
    query?: Record<string, string | undefined>;
    body?: Record<string, string>;
};
type MockResponse = {
    status: ReturnType<typeof jest.fn>;
    json: ReturnType<typeof jest.fn>;
};

/**
 * Jest unit tests call each Express route handler directly.
 * This keeps the test focused on controller behavior without starting a server
 * or requiring a real HTTP client/database.
 */
const getRouteHandler = (method: RouteMethod, path: string) => {
    const layer = (router as any).stack.find(
        (item: any) => item.route?.path === path && item.route.methods[method],
    );
    if (!layer) {
        throw new Error(`Route not found: ${method.toUpperCase()} ${path}`);
    }
    return layer.route.stack[0].handle as (request: RequestData, response: MockResponse) => unknown;
};

const invokeRoute = (method: RouteMethod, path: string, request: RequestData = {}) => {
    const response: MockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    getRouteHandler(method, path)(request, response);
    return response;
};

describe("test user-control.ts", () => {

    test("reads all users", () => {
        const response = invokeRoute("get", "/reads");
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: expect.arrayContaining([
                {id: 1, email: "1@hotmail.com", password: "1"},
                {id: 2, email: "2@hotmail.com", password: "2"},
                {id: 3, email: "3@hotmail.com", password: "3"},
            ]),
        });
    });

    test("reads one user by id", () => {
        const response = invokeRoute("get", "/read", {
            query: {id: "2"},
        });

        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: {
                id: 2,
                email: "2@hotmail.com",
                password: "2",
            },
        });
    });

    test("returns a validation message when read id is missing", () => {
        const response = invokeRoute("get", "/read", {
            query: {id: undefined},
        });
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "not found id",
        });
    });

    test("creates, updates, and deletes a user", () => {
        const createResponse = invokeRoute("post", "/create", {
            body: {
                email: "controller@hotmail.com",
                password: "controller-password",
            },
        });
        const createdUser = createResponse.json.mock.calls[0][0].response;

        expect(createdUser).toEqual({
            id: expect.any(Number),
            email: "controller@hotmail.com",
            password: "controller-password",
        });

        const id = String(createdUser.id);
        const updateResponse = invokeRoute("put", "/update", {
            query: {id},
            body: {email: "updated-controller@hotmail.com"},
        });

        expect(updateResponse.json).toHaveBeenCalledWith({
            status: "accepted",
            response: {
                id: createdUser.id,
                email: "updated-controller@hotmail.com",
                password: "controller-password",
            },
        });

        const deleteResponse = invokeRoute("delete", "/delete", {
            query: {id},
        });

        expect(deleteResponse.json).toHaveBeenCalledWith({
            status: "accepted",
            response: true,
        });
    });

    test("returns a validation message when create data is missing", () => {
        const response = invokeRoute("post", "/create", {
            body: {email: "missing-password@hotmail.com"},
        });

        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "email && password doesn't exist",
        });
    });

    test("returns a validation message when delete id is missing", () => {
        const response = invokeRoute("delete", "/delete", {
            query: {id: undefined},
        });
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "delete failed",
        });
    });
});
