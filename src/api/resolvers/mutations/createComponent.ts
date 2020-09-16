import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateComponentPayload from "../types/mutations/payloads/GraphQLCreateComponentPayload";
import GraphQLCreateComponentInput from "../types/mutations/inputs/GraphQLCreateComponentInput";

let createComponent: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (createComponent === undefined) {
        createComponent = {
            type: GraphQLCreateComponentPayload,
            description: "Creates a new component",
            args: {
                input: {
                    type: GraphQLCreateComponentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return createComponent;
};