import { DatabaseManager } from "../../common/database/DatabaseManager";
import { User } from "../../common/nodes/User";
import { log } from "../../log";
import { ResolverContext } from "../ResolverContext";
import { GraphQLResolveInfo } from "graphql";

export class RootAPIResolver {

    public node(parent: any, args: any, context: ResolverContext, info: GraphQLResolveInfo) {
        log(10, "Node");
        log(10, { parent, args, context, info });
        return {
            id: 123,
            resolveType: "Issue",
            isTypeOf: (value: any, info?: any) => true
        };
    }

    public projects(parent: any, args: any, context: ResolverContext, info: GraphQLResolveInfo) {
        log(10, "Projects");
        log(10, { parent, args, context, info });
        return {};
    }
}