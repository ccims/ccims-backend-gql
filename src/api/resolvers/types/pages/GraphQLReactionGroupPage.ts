import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLReactionGroup from "../nodes/GraphQLReactionGroup";
import GraphQLReactionGroupEdge from "../edges/GraphQLReactionGroupEdge";
import { ResolverContext } from "../../../ResolverContext";

let reactionGroupPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ReactionGroupPage",
    description: "A page of reaction groups",
    interfaces: [GraphQLPage],
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLReactionGroup),
            description: "All reaction groups on this page"
        },
        edges: {
            type: GraphQLList(GraphQLReactionGroupEdge),
            description: "Edges to all nodes containing the cursor"
        },
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
let GraphQLReactionGroupPage = new GraphQLObjectType(reactionGroupPageConfig);
export default GraphQLReactionGroupPage;