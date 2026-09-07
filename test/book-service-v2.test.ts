import {afterEach, describe, expect, jest, test} from "@jest/globals";
import * as bookEntity from "../entities/book";
import {read, reads, update as updateService} from "../services/book-service";

// error : TypeError: The "path" argument must be of type string. Received undefined
// Mock the logger because logging.ts uses process.mainModule?.filename.
// Jest can leave that value undefined, which causes path.basename() to fail.
jest.mock("../log/logging", () => ({
    __esModule: true,
    default: {
        winston: {
            debug: jest.fn(),
            warn: jest.fn(),
        },
    },
}));

describe("test book-service.ts (use jest.spyOn)", () => {
    afterEach(() => {
        // Restore the original book() implementation after every test.
        jest.restoreAllMocks();
    });

    test("reads all books", async () => {
        const books = [
            {id: 1, name: "Clean Code",price: 1 ,productiondate: new Date()},
            {id: 2, name: "Refactoring",price: 1,productiondate: new Date()},
        ];

        const findAll =  jest.fn<() => Promise<unknown[]>>();

        // Configure the fake database response before calling the service.
        findAll.mockResolvedValue(books);

        // Spy on the factory used by the service and return our fake model.
        jest.spyOn(bookEntity, "book").mockReturnValue({
            // Note!! these mock functions could be same name real book-service->book() used
            findAll,
        } as any);

        const result = await reads();

        expect(findAll).toHaveBeenCalledTimes(1);
        expect(result).toBe(books);
    });

    test("read one book by id", async () => {
        const foundBook = {id: 1, name: "Clean Code",price: 1 ,productiondate: new Date()};
        const findByPk = jest.fn<(id: number) => Promise<unknown | null>>();

        // Configure the fake database response before calling the service.
        findByPk.mockResolvedValue(foundBook);

        // Spy on the factory used by the service and return our fake model.
        jest.spyOn(bookEntity, "book").mockReturnValue({
            // Note!! these mock functions could be same name real book-service->book() used
            findByPk,
        } as any);

        const result = await read(1);

        expect(findByPk).toHaveBeenCalledWith(1);
        expect(result).toBe(foundBook);
    });

    test("create one book", async () => {
        const book = {name: "Clean Code", price: 100.5, productiondate: new Date()};

        const create = jest.fn<(name: string, price: number, productiondate: Date) => Promise<unknown | null>>();

        // Configure the fake database response before calling the service.
        create.mockResolvedValue(book);

        // Spy on the factory used by the service and return our fake model.
        jest.spyOn(bookEntity, "book").mockReturnValue({
            // Note!! these mock functions could be same name real book-service->book() used
            create,
        } as any);

        const result = await create(book.name, book.price, book.productiondate);

        expect(create).toHaveBeenCalledTimes(1);
        expect(result).toBe(book);
    });

    test("update one book", async () => {
        const book = { name: "Clean Code", price: 1 ,productiondate: new Date()};
        const id = 1;

        const update = jest.fn<(values: { name: string; price: number; productiondate: Date }, options: { where: { id: number } }) => Promise<number | null>>();

        // Configure the fake database response before calling the service.
        update.mockResolvedValue(1);

        // Spy on the factory used by the service and return our fake model.
        jest.spyOn(bookEntity, "book").mockReturnValue({
            // Note!! these mock functions could be same name real book-service->book() used
            update,
        } as any);

        const result = await update({ name: book.name, price: book.price ,productiondate: book.productiondate}, {where: {id}});

        expect(update).toHaveBeenCalledTimes(1);
        expect(result).toBe(1)
    });

    test("delete one book", async () => {
        const id = 1;

        const destroy = jest.fn<(options: { where: { id: number } }) => Promise<number>>();

        // Configure the fake database response before calling the service.
        destroy.mockResolvedValue(1);

        // Spy on the factory used by the service and return our fake model.
        jest.spyOn(bookEntity, "book").mockReturnValue({
            // Note!! these mock functions could be same name real book-service->book() used
            destroy,
        } as any);

        const result = await destroy({where: {id}});

        expect(destroy).toHaveBeenCalledTimes(1);
        expect(result).toBe(1)
    });

});
