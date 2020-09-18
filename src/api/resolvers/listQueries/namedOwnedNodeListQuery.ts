import { GraphQLObjectType, GraphQLFieldConfig, GraphQLInputObjectType } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import { LoadNamedOwnedNodesCommand } from "../../../common/database/commands/load/nodes/LoadNamedOwnedNodesCommand";
import namedNodeListQuery from "./namedNodeListQuery";

export default (pageType: GraphQLObjectType, filterType: GraphQLInputObjectType, description: string, nodeNamePlural: string):
    GraphQLFieldConfig<any, ResolverContext> & { addParams: (cmd: LoadNamedOwnedNodesCommand<any>, args: any) => any } => {
    const baseQuery = namedNodeListQuery(pageType, filterType, description, nodeNamePlural);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNamedOwnedNodesCommand<any>, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.onOwners = args.filterBy?.owner;
        }
    };
};