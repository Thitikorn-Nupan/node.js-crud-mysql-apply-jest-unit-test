import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {CalculateService} from '../services/calculate-service';

// Jest provides the tools used in this file:
// - describe() groups related tests and makes the test output easier to read.
// - test() defines one behavior that Jest should execute and verify.
// - expect() creates an assertion about the value returned by the code.
// - jest.spyOn() watches a real method so we can verify how it was called.
describe('test calculate-service.ts (use jest.spyOn)', () => {
    let calculateService: CalculateService;

    // beforeEach() runs before every test in this describe block.
    // A fresh service prevents one test from affecting another test.
    beforeEach(() => {
        calculateService = new CalculateService();
    });

    describe('plus()', () => {
        test('should add two numbers and return the total', () => {
            // spyOn() keeps the original implementation but records calls to plus().
            const plusSpy = jest.spyOn(calculateService, 'plus');

            // Call the production code. This is the behavior being tested.
            const result = calculateService.plus(12, 8);

            // toBe() checks that the returned value is exactly 20.
            expect(result).toBe(20);
            // These assertions verify that plus() was called correctly.
            expect(plusSpy).toHaveBeenCalledTimes(1);
            expect(plusSpy).toHaveBeenCalledWith(12, 8);
        });
    });

    describe('minus()', () => {
        test('should subtract the second number from the first number', () => {
            // The spy observes the method without replacing its real calculation.
            const minusSpy = jest.spyOn(calculateService, 'minus');

            const result = calculateService.minus(12, 8);

            expect(result).toBe(4);
            // Jest can verify both the number of calls and the arguments used.
            expect(minusSpy).toHaveBeenCalledTimes(1);
            expect(minusSpy).toHaveBeenCalledWith(12, 8);
        });
    });

    describe('multi()', () => {
        test('should multiply two numbers and return the product', () => {
            const multiSpy = jest.spyOn(calculateService, 'multi');

            const result = calculateService.multi(12, 8);

            expect(result).toBe(96);
            expect(multiSpy).toHaveBeenCalledTimes(1);
            expect(multiSpy).toHaveBeenCalledWith(12, 8);
        });
    });

    describe('divide()', () => {
        test('should divide the first number by the second number', () => {
            const divideSpy = jest.spyOn(calculateService, 'divide');

            const result = calculateService.divide(12, 4);

            expect(result).toBe(3);
            expect(divideSpy).toHaveBeenCalledTimes(1);
            expect(divideSpy).toHaveBeenCalledWith(12, 4);
        });

        test('should return NaN when both numbers are zero', () => {
            // toBeNaN() is Jest's matcher for JavaScript's "Not a Number" value.
            expect(calculateService.divide(0, 0)).toBeNaN();
        });
    });

    describe('decimal calculations', () => {
        test('should preserve decimal results for every operation', () => {
            // One test can contain several related assertions for decimal behavior.
            expect(calculateService.plus(1.5, 2.25)).toBe(3.75);
            expect(calculateService.minus(2.25, 1.5)).toBe(0.75);
            expect(calculateService.multi(1.5, 2.25)).toBe(3.375);
            expect(calculateService.divide(2.25, 1.5)).toBe(1.5);
        });
    });
});
