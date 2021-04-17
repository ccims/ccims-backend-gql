import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteArtifactPayload from "../../types/mutations/payloads/artifact/GraphQLDeleteArtifactPayload";
import GraphQLDeleteArtifactInput from "../../types/mutations/inputs/artifact/GraphQLDeleteArtifactInput";
import { Artifact } from "../../../../common/nodes/Artifact";

function deleteArtifact(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteArtifactPayload, GraphQLDeleteArtifactInput, "Delets the specified artifact");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const artifactId = PreconditionCheck.checkString(input, "artifact", 32);

            const artifact = await context.dbManager.getNode(artifactId);
            if (artifact === undefined || !(artifact instanceof Artifact)) {
                throw new Error("The specified artifact id is not the id of a valid artifact");
            }

            //TODO permissions

            await artifact.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteArtifact;