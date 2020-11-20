import { GraphQLScalarType, ValueNode, Kind, GraphQLScalarTypeConfig, IntValueNode } from "graphql";

const timeSpan: GraphQLScalarTypeConfig<number, number> = {
    name: "TimeSpan",
    description: "A integer number representing the length of the time span in milliseconds\n\n" +
        "Example: `60000` (equivalent to a time span of one minute)",
    serialize: (value: number): number => {
        return Math.max(0, Math.round(value));
    },
    parseValue: (value: number): number => {
        return Math.max(0, Math.round(value));
    },
    parseLiteral: (valueAST: ValueNode): number | null => {
        if (valueAST.kind === Kind.INT) {
            return Math.max(0, parseInt((valueAST as IntValueNode).value, 10));
        }
        return null;
    }
};

export default new GraphQLScalarType(timeSpan);