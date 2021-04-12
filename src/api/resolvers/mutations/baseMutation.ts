import { GraphQLObjectType, GraphQLInputObjectType, GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import { UserPermissions } from "../../../utils/UserPermissions";

type baseMutationType = GraphQLFieldConfig<any, ResolverContext> & {
    /**
     * Creates adds the clientMutationID to the return object
     * @param args The arguments passed to the resolve function
     * @param returnObject The object to be returned where to add the clientMutationID
     */
    createResult: <TReturn extends object>(args: any, returnObject: TReturn) => typeof returnObject & { clientMutationID: string | undefined };
    /**
     * Checks the given args weather they and the `input` property on them are valid objects
     * @param args The arguments as given by the resolve function to be checked
     * @returns The `input` property of the args
     */
    argsCheck: (args: any) => any;
    /**
     * Check weather the current user is allowed to perform this mutation based on his permissions
     *
     * __CAUTION__ This will always suceed if the current user is a global admin
     *
     * @param context The context object provided by the resolve function containing the user
     * @param neededPermissions A predicate function returning `true`/`false`depending on the permissions passed to it
     */
    userAllowed: (context: ResolverContext, neededPermissions: (permissions: UserPermissions) => boolean) => void;
    /**
     * Combined `argsCheck` and `userAllowed` into one method
     */
    initMutation: (args: any, context: ResolverContext, neededPermissions: (permissions: UserPermissions) => boolean) => any;
};

function baseMutation(payload: GraphQLObjectType, input: GraphQLInputObjectType, description: string): baseMutationType {
    const base = {
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
                throw new Error("The arguments are mandatory for the mutation");
            }
            if (!args.input || typeof args.input !== "object") {
                throw new Error("The input for the mutation must be set");
            }
            return args.input;
        },
        userAllowed: (context: ResolverContext, neededPermissions: (permissions: UserPermissions) => boolean) => {
            /*
            if (!context.user.permissions.globalPermissions.globalAdmin && !neededPermissions(context.user.permissions)) {
                throw new Error(`You are not permitted to perform this permission`);
            }
            */
        },
        initMutation: (args: any, context: ResolverContext, neededPermissions: (permissions: UserPermissions) => boolean) => {
            base.userAllowed(context, neededPermissions);
            return base.argsCheck(args);
        }
    };
    return base;
}
export default baseMutation;