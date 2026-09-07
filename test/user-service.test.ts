import {beforeEach, describe, expect, test} from "@jest/globals";
import {UserService} from "../services/user-service";

describe("test user-service.ts", () => {
    let userService: UserService;

    // beforeEach() runs before every test in this describe block.
    // A fresh service prevents one test from affecting another test.
    beforeEach(() => {
        userService = new UserService();
    });

    test("creates a user with the next available id", () => {
        const user = userService.create({
            email: "4@hotmail.com",
            password: "4",
        });

        expect(user).toEqual({
            id: 4,
            email: "4@hotmail.com",
            password: "4",
        });
        expect(userService.read(4)).toEqual(user);
    });

    test("reads all users", () => {
        expect(userService.reads()).toHaveLength(3);
    });

    test("reads one user by id", () => {
        expect(userService.read(2)).toEqual({
            id: 2,
            email: "2@hotmail.com",
            password: "2",
        });
    });

    test("returns undefined when a user does not exist", () => {
        expect(userService.read(99)).toBeUndefined();
    });

    test("updates an existing user without changing its id", () => {
        const updatedUser = userService.update(2, {
            email: "updated@hotmail.com",
        });

        expect(updatedUser).toEqual({
            id: 2,
            email: "updated@hotmail.com",
            password: "2",
        });
    });

    test("returns undefined when updating a missing user", () => {
        expect(userService.update(99, {email: "missing@hotmail.com"})).toBeUndefined();
    });

    test("deletes an existing user", () => {
        expect(userService.delete(2)).toBe(true);
        expect(userService.read(2)).toBeUndefined();
    });

    test("returns false when deleting a missing user", () => {
        expect(userService.delete(99)).toBe(false);
    });
});
