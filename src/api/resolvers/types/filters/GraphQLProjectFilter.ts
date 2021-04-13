import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectTypeConfig } from "graphql";
import { Project } from "../../../../common/nodes/Project";
import { namedNodeFilterFields } from "./namedNodeFilterFields";

const projectFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ProjectFilter",
    description: "Filter for a Project. All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        ...namedNodeFilterFields<Project>("Project"),
        users: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "At least one of the users with the given ids must be part of the project"
        },
        issues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "At least one of the issues given must be on a component assigned to the project"
        },
        description: {
            type: GraphQLString,
            description: "The projects description must match the given __RegEx__"
        }
    })
};
const GraphQLProjectFilter = new GraphQLInputObjectType(projectFilterConfig);
export default GraphQLProjectFilter;