import { GraphQLFieldConfig, GraphQLString, GraphQLResolveInfo } from "graphql";
import { ResolverContext } from "../../ResolverContext";

let testMutation: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLString,
    description: "Returns the given string",
    args: {
        name: {
            type: GraphQLString,
            description: "A name for any object"
        }
    },
    resolve: (parent: any, args: { name: string }, context: ResolverContext, info: GraphQLResolveInfo): string => {
        return args.name;
    }
}

export default testMutation;