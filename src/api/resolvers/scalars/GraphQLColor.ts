import { GraphQLScalarType, ValueNode, Kind, GraphQLScalarTypeConfig, StringValueNode } from "graphql";
import { Color } from "../../../common/Color";

const color: GraphQLScalarTypeConfig<Color, string> = {
    name: "Color",
    description: "A scalar type representing a colour in RGB colour space.\n" +
        "Please note: alpha channel is not supported and will be dropped" +
        "All common CSS formats are supported" + 
        "For a detailed list of supported values, see https://www.npmjs.com/package/color-string",
    serialize: (value: Color): string => {
        return value.toString();
    },
    parseValue: (value: string): Color => {
        return new Color(value);
    },
    parseLiteral: (valueAST: ValueNode): Color | null => {
        if (valueAST.kind === Kind.STRING) {
            return new Color((valueAST as StringValueNode).value);
        }
        return null;
    }
};

export default new GraphQLScalarType(color);