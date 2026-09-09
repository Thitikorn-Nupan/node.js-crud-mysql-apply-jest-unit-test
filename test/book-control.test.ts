import {beforeEach, describe, expect, jest, test} from "@jest/globals";

jest.mock("../services/book-service", () => ({
    reads: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
}));

// Replace the logger methods used by CrudService so the test does not create
// Winston transports or write log output while testing service behavior.
jest.mock("../log/logging", () => ({
    __esModule: true,
    default: {
        winston: {
            debug: jest.fn(),
            warn: jest.fn(),
        },
    },
}));

import router from "../controller/book-control";
import {create, deleteById, read, reads, update,} from "../services/book-service";

type RouteMethod = "get" | "post" | "put" | "delete";
type RequestData = {
    query?: Record<string , string | undefined | number>;
    body?: Record<string, unknown>;
};
type MockResponse = {
    status: ReturnType<typeof jest.fn>;
    json: ReturnType<typeof jest.fn>;
};

/**
 * Jest unit tests call each Express route handler directly.
 * This keeps the test focused on controller behavior without starting a server
 * or requiring a real HTTP client/database. The book service is mocked so
 * these tests verify only the controller's request validation and responses.
 */
const getRouteHandler = (method: RouteMethod, path: string) => {
    // Express stores registered routes in the router's internal stack.
    const layer = (router as any).stack.find(
        // Find the route with the requested HTTP method and URL path.
        (item: any) => item.route?.path === path && item.route.methods[method],
    );

    // Fail clearly when the test asks for a route that was not registered.
    if (!layer) {
        throw new Error(`Route not found: ${method.toUpperCase()} ${path}`);
    }

    // Return the controller function so the test can call it directly.
    return layer.route.stack[0].handle as (request: RequestData, response: MockResponse) => unknown;
};

const invokeRoute = async (method: RouteMethod, path: string, request: RequestData = {}) => {
    // Create a fake Express response object with Jest mock functions.
    const response: MockResponse = {
        // *** mockReturnThis() supports controller chains such as res.status(...).json(...).
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };

    // Execute the selected controller with the test request and fake response.
    // There are two ()() because two different function calls happen in sequence:

    await getRouteHandler(method, path)(request, response);

    // It is equivalent to:
    // const handler = getRouteHandler(method, path);
    // await handler(request, response);

    // Return the response mocks so the test can inspect status and JSON output.
    return response;
};

const mockedReads = reads as jest.MockedFunction<typeof reads>;
const mockedRead = read as jest.MockedFunction<typeof read>;
const mockedCreate = create as jest.MockedFunction<typeof create>;
const mockedUpdate = update as jest.MockedFunction<typeof update>;
const mockedDeleteById = deleteById as jest.MockedFunction<typeof deleteById>;

// describe() groups related tests. Each test() checks one expected behavior.
describe("test book-control.ts", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("reads all books", async () => {
        const books = [{id: 1, name: "Clean Code", price: 100}];
        // mockResolvedValue makes the async findAll() return this fake data.
        mockedReads.mockResolvedValue(books as any);


        const response = await invokeRoute("get", "/reads");

        // .toHaveBeenCalledTimesEnsures that a mock function is called an exact number of times.
        expect(mockedReads).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: books,
        });
    });

    test("reads one book by id", async () => {
        const book = {id: 2, name: "Refactoring", price: 120};
        // mockResolvedValue makes the async findAll() return this fake data.
        mockedRead.mockResolvedValue(book as any);

        const response = await invokeRoute("get", "/read", {
            query: {id: 2},
        });

        expect(mockedRead).toHaveBeenCalledTimes(1);
        expect(mockedRead).toHaveBeenCalledWith(2);
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: book,
        });
    });

    test("returns a validation message when read id is undefined", async () => {
        const response = await invokeRoute("get", "/read", {
            query: {id: undefined},
        });
        expect(mockedRead).not.toHaveBeenCalled();
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "not found id",
        });
    });

    test("creates a book", async () => {
        const book = {id: 3, name: "Domain-Driven Design", price: 150};
        // mockResolvedValue makes the async findAll() return this fake data.
        mockedCreate.mockResolvedValue(book as any);

        const response = await invokeRoute("post", "/create", {
            body: {name: book.name, price: book.price},
        });

        expect(mockedCreate).toHaveBeenCalledWith(
            book.name,
            book.price,
            expect.any(Date),
        );
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: book,
        });
    });

    test("returns a validation message when create data is missing", async () => {
        const response = await invokeRoute("post", "/create", {
            body: {name: "Missing price"},
        });
        expect(mockedCreate).not.toHaveBeenCalled();
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "some these name && price doesn't exist",
        });
    });

    test("updates a book", async () => {
        // mockResolvedValue makes the async findAll() return this fake data.
        mockedUpdate.mockResolvedValue(1);

        const response = await invokeRoute("put", "/update", {
            query: {id: 2},
            body: {name: "Updated book", price: 180},
        });

        expect(mockedUpdate).toHaveBeenCalledTimes(1);
        expect(mockedUpdate).toHaveBeenCalledWith(
            "Updated book",
            180,
            // The failure happens because the controller creates the Date inside the route handler, while new Date() in the test runs a few milliseconds later. They can never reliably be exactly equal.
            // so use Use Jest’s date matcher
            expect.any(Date),
            2,
        );
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: 1,
        });
    });

    test("returns a validation message when update id is undefined", async () => {
        const response = await invokeRoute("put", "/update", {
            query: {id: undefined},
            body: {name: "Updated book", price: 180},
        });
        expect(mockedUpdate).not.toHaveBeenCalled();
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "some these name && price && id doesn't exist",
        });
    });

    test("deletes a book", async () => {
        mockedDeleteById.mockResolvedValue(1);
        const response = await invokeRoute("delete", "/delete", {
            query: {id: 2},
        });
        expect(mockedDeleteById).toHaveBeenCalledTimes(1);
        expect(mockedDeleteById).toHaveBeenCalledWith(2);
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: 1,
        });
    });

    test("returns a validation message when delete id is undefined", async () => {
        const response = await invokeRoute("delete", "/delete", {
            query: {id: undefined},
        });
        expect(mockedDeleteById).not.toHaveBeenCalled();
        expect(response.json).toHaveBeenCalledWith({
            status: "accepted",
            response: "delete failed",
        });
    });
});
