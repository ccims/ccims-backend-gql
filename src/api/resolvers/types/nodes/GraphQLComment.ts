import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ReactionGroup } from "../../../../common/nodes/ReactionGroup";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import reactionsListQuery from "../../listQueries/reactionsListQuery";
import usersListQuery from "../../listQueries/usersListQuery";
import { syncNodeFields } from "./syncNodeFields";
import { Comment } from "../../../../common/nodes/Comment";
import GraphQLDate from "../../scalars/GraphQLDate";

/**
 * Generates the fields for a Comment
 * @param name the name of the Comment
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function commentFields<T extends Comment>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...syncNodeFields<T>(name, namePlural),
        body: {
            type: GraphQLNonNull(GraphQLString),
            description: `The body text of the ${name}.\nMarkdown supported.\n\nMax. 65536 characters`
        },
        bodyRendered: {
            type: GraphQLNonNull(GraphQLString),
            description: `The body text of the ${name} rendered to html`
        },
        currentUserCanEdit: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: `\`true\` iff the User authenticated by the given JWT is permitted to edit this ${name}.\n\nThis only refers to editing the core comment (title, body, etc.)`
        },
        lastEditedAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: `Date when the ${name}'s body was last edited`
        },
        editedBy: usersListQuery<T, User>(`All Users who edited this ${name} (body and/or title)`, comment => comment.editedByProperty),
        reactions: reactionsListQuery<T, ReactionGroup>(`All reactions that have been added to this ${name}`, comment => comment.reactionsProperty)
    };
}

const commentConfig: GraphQLInterfaceTypeConfig<Comment, ResolverContext> = {
    name: "Comment",
    description: "An interface specifying an editable text block (e.g. Issue, Comment)",
    fields: () => commentFields<Comment>("Comment")
};
const GraphQLComment = new GraphQLInterfaceType(commentConfig);
export default GraphQLComment;