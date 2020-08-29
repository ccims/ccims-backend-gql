import { functionToTest } from "../src/index";

describe('calculate', function () {
    it('add', function () {
        let result = functionToTest(5, 2);
        expect(result).toBe(7);
    });
});