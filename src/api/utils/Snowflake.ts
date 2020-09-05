export class SnowflakeGenerator {

    private server: number;
    private processNumber: number;
    private lastIncrement: number;

    public constructor(server?: number, processNumber?: number) {
        let osId = process.platform.toString().charCodeAt(0) & 0x11111;
        this.server = ((server || Math.floor(Math.random() * 0b100000 + osId)) & 0b11111) << (12 + 5);
        this.processNumber = ((processNumber || process.pid) & 0b11111) << 12;
        this.lastIncrement = 0;
    }

    public generate(): Uint32Array {
        let time = Date.now();
        this.lastIncrement++;
        let snowflakeLow = time & 0xffffffff;
        let snowflakeHigh = (((time >> 32) & 0b1111111111) << (5 + 5 + 12)) | this.server | this.processNumber | this.lastIncrement;
        return new Uint32Array([snowflakeHigh, snowflakeLow]);
    }
}