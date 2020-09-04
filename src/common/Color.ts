export class Color {

    private color: { r: number, g: number, b: number, a: number };

    public constructor(colorString: string);
    public constructor(r: number, g: number, b: number, a?: number);
    public constructor(rgba: number);
    public constructor(strOrROrRGBA: string | number, g?: number, b?: number, a?: number) {
        if (typeof strOrROrRGBA === "string" && g === undefined && b === undefined && a === undefined) {
            let noWhitespace = strOrROrRGBA.trim().replace(/\s*/g, "").toLowerCase();
            if (noWhitespace.startsWith("#")) {
                if (noWhitespace.length >= 6) {
                    let aVal = 255;
                    if (noWhitespace.length === 8) {
                        aVal = parseInt(noWhitespace.substr(7, 2), 16);
                    } else if (noWhitespace.length !== 6) {
                        throw new Error("Illegal html color string");
                    }
                    let rVal = parseInt(noWhitespace.substr(1, 2), 16);
                    let gVal = parseInt(noWhitespace.substr(3, 2), 16);
                    let bVal = parseInt(noWhitespace.substr(5, 2), 16);
                    this.color = { r: rVal, g: gVal, b: bVal, a: aVal };
                }
            } else if (noWhitespace.startsWith("rgb")) {
                let colorParts = noWhitespace.substring(noWhitespace.indexOf("(") + 1, noWhitespace.indexOf(")")).split(",");
                let aVal = 255;
                if (noWhitespace.startsWith("rgba") && colorParts.length === 4) {
                    aVal = parseInt(colorParts[3], 10);
                } else if (colorParts.length !== 3) {
                    throw new Error("Illegal css color string");
                }
                let rVal = parseInt(colorParts[0], 10);
                let gVal = parseInt(colorParts[1], 10);
                let bVal = parseInt(colorParts[2], 10);
                this.color = { r: rVal, g: gVal, b: bVal, a: aVal };
            }
        } else if (typeof strOrROrRGBA === "number" && g === undefined && b === undefined && a === undefined) {
            let intNum = Math.max(0, Math.min(0xffffffff, Math.floor(strOrROrRGBA)));
            let rVal = (intNum >> 3 * 8) & 0xff;
            let gVal = (intNum >> 2 * 8) & 0xff;
            let bVal = (intNum >> 8) & 0xff;
            let aVal = (intNum) & 0xff;
            this.color = { r: rVal, g: gVal, b: bVal, a: aVal };
        } else if (typeof strOrROrRGBA === "number" && typeof g === "number" && typeof b === "number" && (typeof a === "number" || a === undefined)) {
            this.color = { r: Color.checkAndRound(strOrROrRGBA), g: Color.checkAndRound(g), b: Color.checkAndRound(b), a: Color.checkAndRound(a || 255) };
        }
        throw new Error("Invalid color");
    }

    private static checkAndRound(value: number): number {
        if (value > 255 || value < 0) {
            throw new Error("Value out of bounds");
        }
        return Math.round(value);
    }

    public get r(): number {
        return this.color.r;
    }

    public get g(): number {
        return this.color.g;
    }

    public get b(): number {
        return this.color.b;
    }

    public get a(): number {
        return this.color.a;
    }

    public toString(): string {
        let alphaStr = this.color.a === 255 ? "" : this.color.a.toString(16).toUpperCase()
        return `#${this.color.r.toString(16).toUpperCase()}${this.color.g.toString(16).toUpperCase()}${this.color.b.toString(16).toUpperCase()}${alphaStr}`;
    }

    public toCssString() {
        return `rgba(${this.color.r.toFixed(0)}, ${this.color.g.toFixed(0)}, ${this.color.b.toFixed(0)}, ${this.color.a.toFixed(0)})`;
    }
}