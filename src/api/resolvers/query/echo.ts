import { GraphQLFieldConfig, GraphQLString, GraphQLResolveInfo } from "graphql";
import { ResolverContext } from "../../ResolverContext";

let echo: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    description: "Returns the string which is given as input",
    args: {
        input: {
            type: GraphQLString,
            description: "The String to be returned"
        }
    },
    resolve: (parent: any, args: { input: string }, context: ResolverContext, info: GraphQLResolveInfo) => {
        return args.input;
    }
};
export default echo;