import { GraphQLID, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { Issue } from "../../../../common/nodes/Issue";
import { Project } from "../../../../common/nodes/Project";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import issueCommentsListQuery from "../../listQueries/issueCommentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import projectsListQuery from "../../listQueries/projectsListQuery";
import GraphQLNode from "../GraphQLNode";

const userConfig: GraphQLInterfaceTypeConfig<User, ResolverContext> = {
    name: "User",
    description: "A user registered ",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLID,
            description: "The unique id of this user"
        },
        username: {
            type: GraphQLString,
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
        ownedProjects: projectsListQuery<User, Project>("All the projects this user ownes of matching `filterBy`", user => user.ownedProjectsProperty),
        ownedComponents: componentsListQuery<User, Component>("All the components this user ownes of matching `filterBy`", user => user.ownedComponentsProperty),
        assignedToIssues: issuesListQuery<User, Issue>("All issues that this the user is assigned to matching (if given) `filterBy`", user => user.assignedToIssuesProperty),
        participantOfIssues: issuesListQuery<User, Issue>("All issues that this the user is a participant of matching (if given) `filterBy`", user => user.participantOfIssuesProperty),
        issueComments: issueCommentsListQuery<User, IssueComment>("All issue comments (not including issues) written by this user", user => user.commentsProperty)
    })
};
const GraphQLUser = new GraphQLInterfaceType(userConfig);
export default GraphQLUser;