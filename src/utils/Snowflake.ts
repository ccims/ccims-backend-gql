export class SnowflakeGenerator {

    private server: number;
    private processNumber: number;
    private lastIncrement: number;
    private dateFn: () => number;

    public constructor(server?: number, processNumber?: number) {
        const osId = process.platform.toString().charCodeAt(0) & 0x11111;
        this.server = ((server || Math.floor(Math.random() * 0b100000 + osId)) & 0b11111) << (12 + 5);
        this.processNumber = ((processNumber || process.pid) & 0b11111) << 12;
        this.lastIncrement = 0;
        this.dateFn = Date.now;
    }

    public set dateSupplier(dateSupplier: () => number) {
        this.dateFn = dateSupplier;
    }

    public generate(): { high: number, low: number } {
        const time = this.dateFn();
        this.lastIncrement++;
        const highPart = (Math.floor(time / 0x400) & 0xffffffff) >>> 0
        return {
            high: highPart,
            low: ((time & 0b1111111111) * (0x400000)) + this.server + this.processNumber + this.lastIncrement
        };
    }

    public generateUint32Array(): Uint32Array {
        const snowflake = this.generate();
        return new Uint32Array([snowflake.high, snowflake.low]);
    }

    public generateString(): string {
        const snowflake = this.generate();
        return snowflake.high.toString(16).padStart(8, "0") + snowflake.low.toString(16).padStart(8, "0");
    }
}