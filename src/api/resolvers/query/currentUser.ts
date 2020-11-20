import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLUser from "../types/nodes/GraphQLUser";

let currentUser: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (currentUser === undefined) {
        currentUser = {
            type: GraphQLUser,
            description: "Returns the user from which the PAI is currently being accessed",
            resolve: (src, args, context, info) => {
                return context.user;
            }
        };
    }
    return currentUser;
}