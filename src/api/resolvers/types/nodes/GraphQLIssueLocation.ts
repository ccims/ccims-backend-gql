import { GraphQLFieldConfigMap, GraphQLInterfaceType, GraphQLInterfaceTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import issuesListQuery from "../../listQueries/issuesListQuery";
import GraphQLNode from "../GraphQLNode";
import { IssueLocation } from "../../../../common/nodes/IssueLocation";
import { Issue } from "../../../../common/nodes/Issue";
import { namedSyncNodeFields } from "./namedSyncNodeFields";

/**
 * Generates the fields for a IssueLocation
 * @param name the name of the IssueLocation
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function issueLocationFields<T extends IssueLocation>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...namedSyncNodeFields<T>(name, namePlural),
        issuesOnLocation: issuesListQuery<IssueLocation, Issue>(`All Issues that are assinged to on this ${name} matching (if given) \`filterBy\``, issueLocation => issueLocation.issuesOnLocationProperty)
    };
}

const issueLocationConfig: GraphQLInterfaceTypeConfig<IssueLocation, ResolverContext> = {
    name: "IssueLocation",
    description: "A location an issue can be assigned to\n\nCurrently this can be either a component or an interface",
    interfaces: () => ([GraphQLNode]),
    fields: () => issueLocationFields<IssueLocation>("IssueLocation")
};
const GraphQLIssueLocation = new GraphQLInterfaceType(issueLocationConfig);
export default GraphQLIssueLocation;