import { GraphQLScalarType, ValueNode, Kind, GraphQLScalarTypeConfig, StringValueNode } from "graphql";

const color: GraphQLScalarTypeConfig<any, string> = {
    name: "JSON",
    description: "The `JSON` scalar is a string in the a JSON format\n\n" +
        "Example: `{\"numbers\": [1,2,3,4]}`",
    serialize: (value: any): string => {
        return JSON.stringify(value);
    },
    parseValue: (value: string): any => {
        return JSON.parse(value);
    },
    parseLiteral: (valueAST: ValueNode): any | null => {
        if (valueAST.kind === Kind.STRING) {
            return JSON.parse((valueAST as StringValueNode).value);
        }
        return null;
    }
};

export default new GraphQLScalarType(color);