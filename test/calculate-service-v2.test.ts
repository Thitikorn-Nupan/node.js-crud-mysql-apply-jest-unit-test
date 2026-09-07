import {expect, test, describe ,jest } from '@jest/globals'; // https://jestjs.io/docs/expect

// Another way use jest.fn() to create service
describe('test calculate-service.ts (use jest.fn)', () => {
    test('should plus ', () => {
        const mockPlusCalculate = jest.fn((a: number, b: number) => a + b);
        const result = mockPlusCalculate(100, 100);
        expect(result).toBe(200);
        expect(mockPlusCalculate).toHaveBeenCalledTimes(1);
    })
    test('should minus ', () => {
        const mockMinusCalculate = jest.fn((a: number, b: number) => a - b);
        const result = mockMinusCalculate(100, 100);
        expect(result).toBe(0);
        expect(mockMinusCalculate).toHaveBeenCalledTimes(1);
    })
    test('should multi ', () => {
        const mockMultiCalculate = jest.fn((a: number, b: number) => a * b);
        const result = mockMultiCalculate(100, 100);
        expect(result).toBe(10000);
        expect(mockMultiCalculate).toHaveBeenCalledTimes(1);
    })
    test('should divide ', () => {
        const mockDivideCalculate = jest.fn((a: number, b: number) => a / b);
        const result = mockDivideCalculate(100, 100);
        expect(result).toBe(1);
        expect(mockDivideCalculate).toHaveBeenCalledTimes(1);
    })
    test('should divide v2 ', () => {
        const mockDivideCalculate = jest.fn((a: number, b: number) => a / b);
        const result = mockDivideCalculate(0,0);
        expect(result).toBeNaN();
        expect(mockDivideCalculate).toHaveBeenCalledTimes(1);
    })
});