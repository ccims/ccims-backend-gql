import { GraphQLScalarType, ValueNode, Kind, GraphQLScalarTypeConfig, StringValueNode } from "graphql";

const date: GraphQLScalarTypeConfig<Date, string> = {
    name: "Date",
    description: "The `Date` scalar is a sting containing a date in a format compatible with _ISO-8601_\n\n" +
        "Example: `2011-10 - 10T14: 48: 00``",
    serialize: (value: Date): string => {
        return value.toISOString();
    },
    parseValue: (value: string): Date => {
        return new Date(value);
    },
    parseLiteral: (valueAST: ValueNode): Date | null => {
        if (valueAST.kind === Kind.STRING) {
            return new Date((valueAST as StringValueNode).value);
        }
        return null;
    }
};

export default new GraphQLScalarType(date);