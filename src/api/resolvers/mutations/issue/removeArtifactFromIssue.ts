import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLRemoveArtifactFromIssuePayload from "../../types/mutations/payloads/issue/GraphQLRemoveArtifactFromIssuePayload";
import GraphQLRemoveArtifactFromIssueInput from "../../types/mutations/inputs/issue/GraphQLRemoveArtifactFromIssueInput";
import { Artifact } from "../../../../common/nodes/Artifact";

function removeArtifactFromIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLRemoveArtifactFromIssuePayload, GraphQLRemoveArtifactFromIssueInput, "Remove a artifact from an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const artifactId = PreconditionCheck.checkString(input, "artifact", 32);

            const artifact = await context.dbManager.getNode(artifactId);
            if (artifact === undefined || !(artifact instanceof Artifact)) {
                throw new Error("The given artifact id is not a valid artifact id");
            }
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            
            const event = await issue.removeArtifact(artifact, new Date(), context.user);
            return base.createResult(args, issue, event, { artifact });
        }
    }
}
export default removeArtifactFromIssue;
