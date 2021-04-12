import { GraphQLNonNull, GraphQLID, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLFieldConfigMap } from "graphql";
import GraphQLIssue from "./GraphQLIssue";
import GraphQLUser from "./GraphQLUser";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLNode from "../GraphQLNode";
import { IssueTimelineItem } from "../../../../common/nodes/timelineItems/IssueTimelineItem";
import { ResolverContext } from "../../../ResolverContext";
import { syncNodeFields } from "./syncNodeFields";

/**
 * Generates the fields for a IssueTimelineItem
 * @param name the name of the IssueTimelineItem
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
 export function issueTimelineItemFields<T extends IssueTimelineItem>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...syncNodeFields<T>(name, namePlural),
        issue: {
            type: GraphQLNonNull(GraphQLIssue),
            description: `The Issue this ${name} belongs to`
        }
    };
}

const issueTimelineItemConfig: GraphQLInterfaceTypeConfig<IssueTimelineItem, ResolverContext> = {
    name: "IssueTimelineItem",
    description: "An event in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLNode]),
    fields: () => issueTimelineItemFields<IssueTimelineItem>("IssueTimelineItem")
};
const GraphQLIssueTimelineItem = new GraphQLInterfaceType(issueTimelineItemConfig);
export default GraphQLIssueTimelineItem;