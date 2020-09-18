import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from "graphql";

const createComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateComponentInput",
    description: "The inputs for the createComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The (non unique) display name of this component\n\nMax. 256 characters"
        },
        owner: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the user who administrates \"owns\" the component"
        },
        description: {
            type: GraphQLString,
            description: "A textual description (of the fuction) of this component.\n\nMax. 65536 characters. `null` equivalent to \"\""
        },
        ims: {
            type: GraphQLNonNull(GraphQLID),
            description: "The IMS used by this component. This must be created before the component\n\nCan be `null`"
        },
        projects: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "If given, the component will be added to the projects with those IDs.\n\nCan be `null`"
        },
        consumedInterfaces: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "If given, the new component will consume the interfacs with the given IDs.\n\nCan be `null`"
        }
    })
};
const GraphQLCreateComponentInput = new GraphQLInputObjectType(createComponentInputConfig);
export default GraphQLCreateComponentInput;