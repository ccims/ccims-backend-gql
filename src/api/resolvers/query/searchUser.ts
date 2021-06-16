import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import { ResolverContext } from "../../ResolverContext";
import GraphQLUser from "../types/nodes/GraphQLUser";

let searchUser: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (searchUser === undefined) {
        searchUser = {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLUser))),
            description: "Searches for users with a similar displayName or username, returns max 10 users",
            args: {
                text: {
                    type: GraphQLNonNull(GraphQLString),
                    description: "The text to search for"
                }
            },
            resolve: async (src, args, context, info) => {
                if (!args.text) {
                    return [];
                } else {
                    const command = new LoadUsersCommand();
                    command.searchText = args.text;
                    command.limit = 10;
                    context.dbManager.addCommand(command);
                    await context.dbManager.executePendingCommands();
                    return command.getResult();
                }
            }
        };
    }
    return searchUser;
}