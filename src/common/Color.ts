import * as ColorLib from "color";

export class Color {

    private color: string;

    /**
     * Creates a new color instance
     * please note that alpha channel is not supported and is therefore dropped
     * For an overview of supported schemas, please have a look at https://www.npmjs.com/package/color-string
     * @param colorString the string which is transformed into a color hex string
     */
    public constructor(colorString: string) {
        this.color = ColorLib.default(colorString).hex();
    }

    public toString(): string {
        return this.color;
    }
}