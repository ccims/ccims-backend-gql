import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import GraphQLCreateArtifactPayload from "../../types/mutations/payloads/artifact/GraphQLCreateArtifactPayload";
import GraphQLCreateArtifactInput from "../../types/mutations/inputs/artifact/GraphQLCreateArtifactInput";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { Component } from "../../../../common/nodes/Component";
import { Artifact } from "../../../../common/nodes/Artifact";

function createArtifact(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateArtifactPayload, GraphQLCreateArtifactInput, "Create a new artifact in the system");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);
            const uri = PreconditionCheck.checkString(input, "uri", 65536);
            const lineRangeStart = PreconditionCheck.checkNullableInteger(input, "lineRangeStart");
            const lineRangeEnd = PreconditionCheck.checkNullableInteger(input, "lineRangeEnd");
            const componentId = PreconditionCheck.checkString(input, "component", 32);

            //TODO permissions

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The given component id is not a valid component id");
            }

            const artifact = await Artifact.create(context.dbManager, component, uri, lineRangeStart, lineRangeEnd, context.user, new Date());
            return base.createResult(args, { artifact });
        }
    }
}
export default createArtifact;