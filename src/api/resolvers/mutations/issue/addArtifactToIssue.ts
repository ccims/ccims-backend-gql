import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddArtifactToIssuePayload from "../../types/mutations/payloads/issue/GraphQLAddArtifactToIssuePayload";
import GraphQLAddArtifactToIssueInput from "../../types/mutations/inputs/issue/GraphQLAddArtifactToIssueInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { Artifact } from "../../../../common/nodes/Artifact";

function addArtifactToIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddArtifactToIssuePayload, GraphQLAddArtifactToIssueInput, "Adds a artifact to an issue");
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

            if (!(await issue.componentsProperty.hasId(artifact.componentProperty.getId() ?? ""))) {
                throw new Error("The artifact you are tying to assign is not on at least one of the components the issue is on");
            }
            const event = await issue.addArtifact(artifact, new Date(), context.user);
            return base.createResult(args, issue, event, { artifact });
        }
    }
}
export default addArtifactToIssue;
