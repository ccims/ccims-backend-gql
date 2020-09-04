import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLColor from "../../scalars/GraphQLColor";
import projects from "../../listQueries/projects";

export default new GraphQLObjectType({
    name: "Label",
    description: "A label assignable to issues. A label is per-project",
    interfaces: [GraphQLNode],
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this label"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the label to display.\n\n Max. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "A text describing the labels' function\n\nMax. 65536 characters"
        },
        color: {
            type: GraphQLColor,
            description: "The color of the label in the GUI"
        },
        projects
    }
})