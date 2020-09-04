import { GraphQLScalarType, ValueNode, astFromValue, Kind, GraphQLScalarTypeConfig, StringValueNode } from "graphql";
import { Color } from "../../../common/Color";

let color: GraphQLScalarTypeConfig<Color, string> = {
    name: "Color",
    description: `A scalar type representing a colour in RGB colour space.\n
    The scalar must be a string in CSS Colour Hex format:\n\n
    \`#rrggbb\` where \`rr\`, \`gg\`, \`bb\` are the hex values between _0_ and _ff_\n\n
    
    Example: \`#ffff00\` (would be a _beautiful_ yellow)`,
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