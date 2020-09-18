import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateProjectPayload from "../types/mutations/payloads/GraphQLCreateProjectPayload";
import GraphQLCreateProjectInput from "../types/mutations/inputs/GraphQLCreateProjectInput";

let createProject: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (createProject === undefined) {
        createProject = {
            type: GraphQLCreateProjectPayload,
            description: "Creates a new project",
            args: {
                input: {
                    type: GraphQLCreateProjectInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return createProject;
};