import { GraphQLFieldConfig, GraphQLObjectType, GraphQLInputObjectType } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import { UserPermissions, ComponentPermission } from "../../../../utils/UserPermissions";
import baseMutation from "../baseMutation";
import { Issue } from "../../../../common/nodes/Issue";
import { LoadIssuesCommand } from "../../../../common/database/commands/load/nodes/LoadIssuesCommand";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IssueTimelineItem } from "../../../../common/nodes/timelineItems/IssueTimelineItem";

type timelineMutationType = GraphQLFieldConfig<any, ResolverContext> & {
    /**
     * Creates adds the clientMutationID to the return object
     * @param args The arguments passed to the resolve function
     * @param returnObject The object to be returned where to add the clientMutationID
     */
    createResult: <TReturn extends object>(args: any, issue: Issue, event: IssueTimelineItem | undefined, returnObject: TReturn) => typeof returnObject & { clientMutationID: string | undefined, issue: Issue, event: typeof event, timelineEdge: ({ cursor: string, node: typeof event }) | undefined };
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
    /**
     * Checks if `issue` is given and returns the input object as well as a LoadIssuesCommand
     */
    initTimelineMutation: (args: any, context: ResolverContext) => { cmd: LoadIssuesCommand, input: any };
    /**
     * Executes the given load command and checks the users permission for hat issue. If positive, returns the issue
     */
    getIssue: (cmd: LoadIssuesCommand, context: ResolverContext, neededPermissions: (permissions: ComponentPermission, issue: Issue) => boolean) => Promise<Issue>;
};

function timelineMutation(payload: GraphQLObjectType, input: GraphQLInputObjectType, description: string): timelineMutationType {
    const base = baseMutation(payload, input, description);
    return {
        ...base,
        initTimelineMutation: (args: any, context: ResolverContext): { cmd: LoadIssuesCommand, input: any } => {
            const inputArgs = base.argsCheck(args);
            const issueId = PreconditionCheck.checkString(inputArgs, "issue", 32);
            const issueCmd = new LoadIssuesCommand();
            issueCmd.ids = [issueId];
            return { cmd: issueCmd, input: inputArgs };
        },
        getIssue: async (cmd: LoadIssuesCommand, context: ResolverContext, neededPermissions: (permissions: ComponentPermission, issue: Issue) => boolean): Promise<Issue> => {
            context.dbManager.addCommand(cmd);
            await context.dbManager.executePendingCommands();
            if (cmd.getResult().length !== 1) {
                throw new Error(`The given id is no valid issue id`);
            }
            const issue = cmd.getResult()[0];
            /*
            if (!context.user.permissions.globalPermissions.globalAdmin && !(await issue.componentsProperty.getIds()).some(id => {
                const perm = context.user.permissions.getComponentPermissions(id);
                return neededPermissions(perm, issue);
            })) {
                throw new Error(`You have to have the permission to perform this mutation on the issue`);
            }
            */
            return issue;
        },
        createResult: <TReturn extends object>(args: any, issue: Issue, event: IssueTimelineItem | undefined, returnObject: TReturn): typeof returnObject & { clientMutationID: string | undefined, issue: Issue, event: typeof event, timelineEdge: ({ cursor: string, node: typeof event }) | undefined } => {
            return base.createResult(args, {
                ...returnObject,
                issue,
                event,
                timelineEdge: event ? ({
                    cursor: event.id,
                    node: event
                }) : undefined
            });
        }
    };
}
export default timelineMutation;