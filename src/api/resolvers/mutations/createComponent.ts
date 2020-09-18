import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateComponentPayload from "../types/mutations/payloads/GraphQLCreateComponentPayload";
import GraphQLCreateComponentInput from "../types/mutations/inputs/GraphQLCreateComponentInput";
import { Component } from "../../../common/nodes/Component";
import { User } from "../../../common/nodes/User";

let createComponent: GraphQLFieldConfig<any, ResolverContext> | undefined;
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
            },
            resolve: (source, args, context, info) => {
                if (context.dbManager) {

                }
                return undefined;
            }
        };
    }
    return createComponent;
};