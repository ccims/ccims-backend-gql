import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLInputFieldConfigMap } from "graphql";
import { IssueLocation } from "../../../../common/nodes/IssueLocation";
import { syncNodeFilterFields } from "./syncNodeFilterFields";

/**
 * Generates the fields for a IssueLocation filter
 * @param name the name of the IssueLocation
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function issueLocationFilterFields<T extends IssueLocation>(name: string, namePlural: string = name + "s"): GraphQLInputFieldConfigMap {
    return syncNodeFilterFields<T>(name, namePlural);
}

const issueLocationFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueLocationFilter",
    description: "Filters for Issues locations (components and interfaces). All parameters given in this filter will be connected via _AND_",
    fields: () => issueLocationFilterFields<IssueLocation>("IssueLocation")
};
const GraphQLIssueLocationFilter = new GraphQLInputObjectType(issueLocationFilterConfig);
export default GraphQLIssueLocationFilter;