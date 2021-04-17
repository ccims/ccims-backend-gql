import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateArtifactPayload from "../../types/mutations/payloads/artifact/GraphQLUpdateArtifactPayload";
import GraphQLUpdateArtifactInput from "../../types/mutations/inputs/artifact/GraphQLUpdateArtifactInput";
import { Artifact } from "../../../../common/nodes/Artifact";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function updateArtifact(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateArtifactPayload, GraphQLUpdateArtifactInput, "Updates a Artifact in the ccims. Fields which are not provided are not updated.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const artifactId = PreconditionCheck.checkString(input, "artifact", 32);

            const uri = PreconditionCheck.checkNullableString(input, "uri", 65536);
            const lineRangeStart = PreconditionCheck.checkNullableInteger(input, "lineRangeStart");
            const lineRangeEnd = PreconditionCheck.checkNullableInteger(input, "lineRangeEnd");

            //TODO permissions

            const artifact = await context.dbManager.getNode(artifactId);
            if (artifact === undefined || !(artifact instanceof Artifact)) {
                throw new Error("The specified artifact id is not the id of a valid artifact");
            }

            if (uri !== undefined) {
                artifact.setUri(uri, new Date());
            }
            if (lineRangeStart !== undefined) {
                artifact.setLineRangeStart(lineRangeStart === null ? undefined : lineRangeStart, new Date());
            }
            if (lineRangeEnd !== undefined) {
                artifact.setLineRangeStart(lineRangeEnd === null ? undefined : lineRangeEnd, new Date());
            }

            return base.createResult(args, context, { artifact: artifact });
        }
    };
}
export default updateArtifact;