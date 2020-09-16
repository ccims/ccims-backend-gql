import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateIMSPayload from "../types/mutations/payloads/GraphQLCreateIMSPayload";
import GraphQLCreateIMSInput from "../types/mutations/inputs/GraphQLCreateIMSInput";

let createIMS: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (createIMS === undefined) {
        createIMS = {
            type: GraphQLCreateIMSPayload,
            description: "Creates a new IMS",
            args: {
                input: {
                    type: GraphQLCreateIMSInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return createIMS;
};