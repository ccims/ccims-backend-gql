import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLAddedToComponentEvent from "../../../nodes/timelineItems/GraphQLAddedToComponentEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLIssue from "../../../nodes/GraphQLIssue";

const addIssueToComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddIssueToComponentPayload",
    description: "The Payload/Response for the addIssueToComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component (with its IMS) to which the issue was added"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which added to the component and its IMS"
        },
        event: {
            type: GraphQLAddedToComponentEvent,
            description: "The issue timeline event for the addition of this issue to this component"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLAddIssueToComponentPayload = new GraphQLObjectType(addIssueToComponentPayloadConfig);
export default GraphQLAddIssueToComponentPayload;