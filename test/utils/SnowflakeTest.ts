import { SnowflakeGenerator } from "../../src/utils/Snowflake";

describe("regularSnowflakeTests", function () {
    const gen = new SnowflakeGenerator();
    const pid = process.pid & 0b11111;
    let i = 1;
    it("testGenerate", function () {
        for (i; i <= 20; i++) {
            let date = Date.now();
            let result = gen.generate();
            expect(result.high).toBe(Math.floor(date / 0x400) & 0xffffffff);
            expect((result.low >> (12 + 5 + 5)) & 0b1111111111).toBe(date & 0b1111111111);
            expect(result.low & 0xfff).toBe(i);
            expect((result.low >> 12) & 0b11111).toBe(pid);
        }
    });
    it("testGenerateString", () => {
        for (i; i <= 40; i++) {
            let dateNum = Date.now();
            let result = gen.generateString();
            let date = dateNum.toString(2).padStart(42, "0");
            date = date.substr(0, 39);
            expect(result.length).toBe(64 / 4);
            var resultBin = result.split('').map(x => parseInt(x, 16).toString(2).padStart(4, "0")).join("");
            expect(resultBin.substr(0, 39)).toBe(date);
            expect(resultBin.substr(47, 5)).toBe(pid.toString(2).padStart(5, "0"));
            expect(resultBin.substr(52, 12)).toBe(i.toString(2).padStart(12, "0"));
        }
    });
    it("testGenerateUint32Array", function () {
        for (i; i <= 60; i++) {
            let date = Date.now();
            let result = gen.generateUint32Array();
            expect(result[0]).toBe(Math.floor(date / 0x400) & 0xffffffff);
            expect((result[1] >> (12 + 5 + 5)) & 0b1111111111).toBe(date & 0b1111111111);
            expect(result[1] & 0xfff).toBe(i);
            expect((result[1] >> 12) & 0b11111).toBe(pid);
        }
    });
    it("testRuntime", async () => {
        await new Promise((resolve) => {
            for (i; i < 1060; i++) {
                gen.generateString();
            }
            resolve();
        });
    }, 100);
    it("testUnique", () => {
        let generated: { [id: string]: boolean } = {};
        for (i; i < 100000; i++) {
            var id = gen.generateString();
            if (generated[id]) {
                fail(id + " was generated twice");
            }
            generated[id] = true;
        }
    });
});

describe("knownDataSnowflakeTests", function () {
    const gen = new SnowflakeGenerator(0b11001, 0b00101);
    gen.dateSupplier = () => 0b101100111000111100001111100000111111000000111;
    it("testConsistency", () => {
        for (var i = 1; i <= 100; i++) {
            let result = gen.generateString();
            var resultBin = result.split('').map(x => parseInt(x, 16).toString(2).padStart(4, "0")).join("");
            expect(result.length).toBe(64 / 4);
            expect(resultBin.substr(0, 42)).toBe("100111000111100001111100000111111000000111");
            expect(resultBin.substr(42, 5)).toBe("11001");
            expect(resultBin.substr(47, 5)).toBe("00101");
            expect(resultBin.substr(52, 12)).toBe(i.toString(2).padStart(12, "0"));
        }
    });
});