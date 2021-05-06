import { GraphQLFieldConfig } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ResolverContext } from "../../ResolverContext";
import { Page } from "../utils/Page";

/**
 * Basic type for all listQueries
 */
export type listQueryType<TSource extends CCIMSNode, TNode extends CCIMSNode, TCommand> = GraphQLFieldConfig<TSource, ResolverContext> &
{
    /**
     * Adds limiting parameters
     * @param cmd The command into which to insert the limits given in the arguments in the second parameter
     * @param args The arguments containing the inputs from the GraphQL request. The needed fields of this will be inserted into the command
     */
    addParams: (cmd: LoadNodeListCommand<TNode> & TCommand, args: any) => void,

    /**
     * Takes a command with all filters added, executes it and returns a page with the results
     *
     * The command is executed eiter directly on the database manager or on a property, depending on the given `propertyProvider`.
     * If the `propertyProvider` is `undefined` or returns `undefined`, a root query will be executed on the database manager.
     * If there a valid property is returned by the `propertyProvider`, the command will executed on the property
     *
     * @param src If not a root query - The source node on which the property is used and on which to execure the given property provider
     * @param context The `ResolverContext` object provided by the resolve function, containing a valid `dbManager`
     * @param cmd The command containing all the set filters to be executed
     */
    createResult: (src: TSource, context: ResolverContext, cmd: LoadNodeListCommand<TNode> & TCommand) => Promise<Page<TNode>>
};