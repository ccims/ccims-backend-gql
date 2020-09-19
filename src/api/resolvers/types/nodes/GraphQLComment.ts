import { GraphQLBoolean, GraphQLID, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { Comment } from "../../../../common/nodes/timelineItems/Comment";
import { ResolverContext } from "../../../ResolverContext";
import reactionsListQuery from "../../listQueries/reactionsListQuery";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLUser from "./GraphQLUser";

const commentConfig: GraphQLInterfaceTypeConfig<Comment, ResolverContext> = {
    name: "Comment",
    description: "An interface specifying an editable text block (e.g. Issue, Comment)",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this comment"
        },
        body: {
            type: GraphQLString,
            description: "The body text of the comment.\nMarkdown supported.\n\nMax. 65536 characters"
        },
        bodyRendered: {
            type: GraphQLString,
            description: "The body text of the comment rendered to html"
        },
        createdBy: {
            type: GraphQLUser,
            description: "The user who originally created the comment (in ccims or any ims)"
        },
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLUser)),
            description: "A list of all people who edited the root of this comment (body and title)"
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the comment was first created on"
        },
        lastEditedAt: {
            type: GraphQLDate,
            description: "Date when the core comment(title, body etc.) was last changed (comments and other events DO NOT count)"
        },
        currentUserCanEdit: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the user authenticated by the given JWT is permitted to edit this comment.\n\nThis only refers to editing the core comment (title, body, etc.)"
        },
        reactions: reactionsListQuery("All reactions that have been added to this comment", comment => comment.reactionsProperty),
    })
};
const GraphQLComment = new GraphQLInterfaceType(commentConfig);
export default GraphQLComment;