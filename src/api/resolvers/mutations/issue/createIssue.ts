import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateIssuePayload from "../../types/mutations/payloads/issue/GraphQLCreateIssuePayload";
import GraphQLCreateIssueInput from "../../types/mutations/inputs/issue/GraphQLCreateIssueInput";
import baseMutation from "../baseMutation";

function createIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIssuePayload, GraphQLCreateIssueInput, "Creates a new issue");
    return {
        ...base,
        resolve: (src, args, context, info) => {
            const input = base.argsCheck(args);

        }
    };
}
export default createIssue;