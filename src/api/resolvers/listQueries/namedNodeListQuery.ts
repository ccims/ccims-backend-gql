import { GraphQLObjectType, GraphQLFieldConfig, GraphQLInputObjectType } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import nodeListQuery from "./nodeListQuery";
import { LoadNamedNodesCommand } from "../../../common/database/commands/load/nodes/LoadNamedNodeCommand";

export default (pageType: GraphQLObjectType, filterType: GraphQLInputObjectType, description: string, nodeNamePlural: string):
    GraphQLFieldConfig<any, ResolverContext> & { addParams: (cmd: LoadNamedNodesCommand<any>, args: any) => any } => {
    const baseQuery = nodeListQuery(pageType, filterType, description, nodeNamePlural);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNamedNodesCommand<any>, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.onName = args.filterBy?.name;
            cmd.onDescription = args.filterBy?.description;
        }
    };
};