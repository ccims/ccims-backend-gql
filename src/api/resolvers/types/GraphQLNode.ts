import { GraphQLObjectType, GraphQLInt, GraphQLInterfaceType, GraphQLID } from "graphql";

export default new GraphQLInterfaceType({
    name: "Node",
    description: "An object which can be identified by an ID - called a node",
    fields: {
        id: {
            type: GraphQLID,
            description: "The ID of this node. Every node will have an non-empty and non-null edge.\n\nIf this is ever empty or null, something went wrong."
        }
    }
});