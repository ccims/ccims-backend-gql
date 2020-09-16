import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import GraphQLTimeSpan from "../../../../scalars/GraphQLTimeSpan";

let changeIssueEstimatedTimeInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueEstimatedTimeInput",
    description: "The inputs for the changeIssueEstimatedTime",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue for which to change the estimated time"
        },
        newEstimatedTime: {
            type: GraphQLNonNull(GraphQLTimeSpan),
            description: "The time span to be set as new estimated time for the issue"
        }
    })
};
let GraphQLChangeIssueEstimatedTimeInput = new GraphQLInputObjectType(changeIssueEstimatedTimeInputConfig);
export default GraphQLChangeIssueEstimatedTimeInput;