import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateComponentPayload from "../types/mutations/payloads/GraphQLCreateComponentPayload";
import GraphQLCreateComponentInput from "../types/mutations/inputs/GraphQLCreateComponentInput";
import { Component } from "../../../common/nodes/Component";
import { User } from "../../../common/nodes/User";
import baseMutation from "./baseMutation";

function createComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateComponentPayload, GraphQLCreateComponentInput, "Creates a new component in the ccims and adds it to the given users");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);

            /*const component = await Component.create();
            return base.createResult(args, {component});*/
        }
    };
}
export default createComponent;