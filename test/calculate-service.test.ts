import {expect, test, describe ,beforeEach } from '@jest/globals'; // // https://jestjs.io/docs/expect
import {CalculateService} from "../services/calculate-service";

// Basic way use your service
describe('test calculate-service.ts', () => {
    let calculateService : CalculateService ;
    // Initialize a new service instance before each test
    beforeEach(() => {
        calculateService = new CalculateService();
    });
    test('should plus ', () => {
        const result = calculateService.plus(100,100);
        expect(result).toBe(200);
    })
    test('should plus v2 ', () => {
        const result = calculateService.plus(100,0);
        expect(result).toEqual(100)
    })
    test('should minus ', () => {
        const result = calculateService.minus(100,100);
        expect(result).toBe(0);
    })
    test('should multi ', () => {
        const result = calculateService.multi(100,100);
        expect(result).toBe(10000);
    })
    test('should divide ', () => {
        const result = calculateService.divide(100,100);
        expect(result).toBe(1);
    })
});


