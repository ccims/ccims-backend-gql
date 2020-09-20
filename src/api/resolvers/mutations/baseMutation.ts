import { GraphQLObjectType, GraphQLInputObjectType, GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { ResolverContext } from "../../ResolverContext";

type baseMutationType = GraphQLFieldConfig<any, ResolverContext> & {
    /**
     * Creates adds the clientMutationID to the return object
     * @param args The arguments passed to the reslve fuction
     * @param returnObject The object to be returned where to add the clientMutationID
     */
    createResult: <TReturn extends object>(args: any, returnObject: TReturn) => typeof returnObject & { clientMutationID: string | undefined };
    /**
     * Checks the given args weather they and the `input` property on them are valid objects
     * @param args The arguments as given by the resolve function to be checked
     * @returns The `input` property of the args
     */
    argsCheck: (args: any) => any;
};

function baseMutation(payload: GraphQLObjectType, input: GraphQLInputObjectType, description: string): baseMutationType {
    return {
        type: payload,
        description,
        args: {
            input: {
                type: GraphQLNonNull(input),
                description: "The data for the mutation"
            }
        },
        createResult: <TReturn extends object>(args: any, returnObject: TReturn) => {
            if (typeof args.input.clientMutationID !== "string" && typeof args.input.clientMutationID !== "undefined") {
                throw new Error("The client mutation id must be a string or not set");
            }
            return {
                ...returnObject,
                clientMutationID: args.input.clientMutationID
            };
        },
        argsCheck: (args: any) => {
            if (!args || typeof args !== "object") {
                throw new Error("The arguments are mandatorey for the mutation");
            }
            if (!args.input || typeof args.input !== "object") {
                throw new Error("The input for the mutation must be set");
            }
            return args.input;
        }
    };
}
export default baseMutation;