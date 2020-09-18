import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import projectsListQuery from "../../listQueries/projectsListQuery";
import assignedToIssues from "../../listQueries/user/assignedToIssues";
import participantOfIssues from "../../listQueries/user/participantOfIssues";
import issueComments from "../../listQueries/user/issueComments";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";

let userConfig: GraphQLObjectTypeConfig<User, ResolverContext> = {
    name: "User",
    description: "A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this user"
        },
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: "The unique username used for login"
        },
        displayName: {
            type: GraphQLString,
            description: "The name of the user to display in the GUI"
        },
        email: {
            type: GraphQLString,
            description: "The mail address of the user"
        },
        projects: projectsListQuery("All the projects this user is a participant of matching `filterBy`", user => user.projectsProperty),
        assignedToIssues: assignedToIssues(),
        participantOfIssues: participantOfIssues(),
        issueComments: issueComments()
    })
};
let GraphQLUser = new GraphQLObjectType(userConfig);
export default GraphQLUser;