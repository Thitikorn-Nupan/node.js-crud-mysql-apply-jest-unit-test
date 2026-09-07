import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals";
import {book} from "../entities/book";
import {read, reads,create as createService , update as updateService, deleteById as deleteService} from "../services/book-service";

// Replace the real book model factory with a Jest mock.
// This prevents the test from creating a Sequelize/MySQL connection. สิ่งนี้ช่วยป้องกันไม่ให้การทดสอบสร้างการเชื่อมต่อ Sequelize/MySQL
jest.mock("../entities/book", () => ({
    book: jest.fn(),
}));

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

describe("test book-service.ts", () => {
    // A mock function has no useful TypeScript argument type by default.
    // These signatures describe the same methods used by the service.
    // Note!! these mock functions could be same parameter real book-service used
    const readsModel = jest.fn<() => Promise<unknown[]>>();
    const readModel = jest.fn<(id: number) => Promise<unknown | null>>();
    const createModel = jest.fn<(name: string, price: number, productiondate: Date) => Promise<unknown | null>>(); // await book().create({name, price, productiondate})
    const updateModel = jest.fn<(
        values: { name: string; price: number; productiondate: Date },
        options: { where: { id: number } }
    ) => Promise<[number]>>(); // follow this await book().update({name, price, productiondate}, {where: {id},});
    const deleteModel = jest.fn<(options: { where: { id: number } }) => Promise<number>>(); // follow this await book().destroy({where: {id},});
    const mockedBook = book as jest.MockedFunction<typeof book>;

    // beforeEach runs before every test and gives the service a mocked model.
    beforeEach(() => {
        // Note!! these mock functions could be same name real book-service->book() used
        mockedBook.mockReturnValue({
            findAll: readsModel,
            findByPk: readModel,
            create: createModel,
            update: updateModel, // have to be named update
            destroy: deleteModel, // have to be named destroy
        } as any);
    });

    // clearAllMocks removes call history so tests remain independent.
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("reads all books", async () => {
        const books = [
            {id: 1, name: "Clean Code",price: 1 ,productiondate: new Date()},
            {id: 2, name: "Refactoring",price: 1,productiondate: new Date()},
        ];
        // mockResolvedValue makes the async findAll() return this fake data.
        readsModel.mockResolvedValue(books);

        // resolves checks that the Promise succeeds and returns the expected value.
        await expect(reads()).resolves.toBe(books);
        // Verify that the service called the repository method once.
        expect(readsModel).toHaveBeenCalledTimes(1);
        expect(readsModel).not.toBeNull();
    });

    test("read one book by id", async () => {
        const foundBook = {id: 1, name: "Clean Code",price: 1 ,productiondate: new Date()};
        // Configure the fake database response before calling the service.
        readModel.mockResolvedValue(foundBook);

        // read(1) should return the same object supplied by the mock.
        await expect(read(1)).resolves.toBe(foundBook);
        // Verify that the requested ID was passed to findByPk().
        expect(readModel).toHaveBeenCalledWith(1);
        expect(readModel).not.toBeNull();
    });

    test("create one book", async () => {
        const book = {name: "Clean Code", price: 100.5, productiondate: new Date()};
        // Configure the fake database response before calling the service.
        createModel.mockResolvedValue(book);
        // read(1) should return the same object supplied by the mock.
        await expect(createService(book.name, book.price, book.productiondate)).resolves.toBe(book);
        // Verify that the requested ID was passed to findByPk().
        expect(createModel).toHaveBeenCalledTimes(1);
        expect(createModel).not.toBeNull();
    });

    // *** It's following real service
    test("update one book", async () => {
        const book = { name: "Clean Code", price: 1 ,productiondate: new Date()};
        const id = 1;
        // Sequelize update() returns a tuple. The first value is the
        // number of rows affected by the update.
        updateModel.mockResolvedValue([1]);
        // The service forwards the values and the Sequelize where option.
        await expect(updateService(book.name, book.price, book.productiondate, id)).resolves.toBe(1);
        expect(updateModel).toHaveBeenCalledWith({ name: book.name, price: book.price ,productiondate: book.productiondate}, {where: {id}});
    });

    test("delete one book", async () => {
        const id = 1;
        // Sequelize update() returns a tuple. The first value is the
        // number of rows affected by the update.
        deleteModel.mockResolvedValue(1);
        // The service forwards the values and the Sequelize where option.
        await expect(deleteService(id)).resolves.toBe(1);
        expect(deleteModel).toHaveBeenCalledWith({where: {id}});
    });

});
