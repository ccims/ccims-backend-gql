import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLID } from "graphql";
import GraphQLDate from "../../../../scalars/GraphQLDate";
import GraphQLIssueCategory from "../../../../enums/GraphQLIssueCategory";
import GraphQLTimeSpan from "../../../../scalars/GraphQLTimeSpan";

const createIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateIssueInput",
    description: "The inputs for the createIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        title: {
            type: GraphQLNonNull(GraphQLString),
            description: "The human readable title for the new issue.\n\nThis can't be `null`. Max. 256 caracters."
        },
        body: {
            type: GraphQLString,
            description: "The body text for the issue as markdown.\n\nThis can be `null` (will result in an empty body). Max. 65536 characters"
        },
        components: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))),
            description: "The IDs of the components the issue is mirrored to.\n\nAt least one valid component must be given."
        },
        category: {
            type: GraphQLIssueCategory,
            description: "The category to assign the issue to.\n\nIf none is given, the issue wil have the category `UNCLASSIFIED`."
        },
        labels: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "A list of all label IDs to assign to the new issue.\n\nIf `null`, none will be assigned."
        },
        assignees: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "A list of user IDs to added as assignees to the issue.\n\nIf `null`, no users will be assigned"
        },
        locations: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "A list of IDs of issue locations to add the issue to.\n\nIf `null`, the issue will not be assigned to any locations"
        },
        startDate: {
            type: GraphQLDate,
            description: "The start date to be set for the issue.\n\nIf `null`, none will be set"
        },
        dueDate: {
            type: GraphQLDate,
            description: "The due date to be set for the issue.\n\nIf `null`, none will be set"
        },
        estimatedTime: {
            type: GraphQLTimeSpan,
            description: "The estimated time to be set for the issue.\n\nIf `null`, none will be set"
        },
    })
};
const GraphQLCreateIssueInput = new GraphQLInputObjectType(createIssueInputConfig);
export default GraphQLCreateIssueInput;