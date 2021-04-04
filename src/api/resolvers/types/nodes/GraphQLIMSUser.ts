import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { Issue } from "../../../../common/nodes/Issue";
import { Project } from "../../../../common/nodes/Project";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import issueCommentsListQuery from "../../listQueries/issueCommentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import projectsListQuery from "../../listQueries/projectsListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";
import GraphQLIMS from "./GraphQLIMS";
import { IMSUser } from "../../../../common/nodes/IMSUser";

const imsUserConfig: GraphQLObjectTypeConfig<IMSUser, ResolverContext> = {
    name: "IMSUser",
    description: "A user of the ims. Can be assigned to projects, components",
    interfaces: () => ([GraphQLNode, GraphQLUser]),
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
        ims: {
            type: GraphQLIMS,
            description: "The associated IMS of the user"
        },
        ownedProjects: projectsListQuery<IMSUser, Project>("All the projects this user ownes of matching `filterBy`", user => user.ownedProjectsProperty),
        ownedComponents: componentsListQuery<IMSUser, Component>("All the components this user ownes of matching `filterBy`", user => user.ownedComponentsProperty),
        assignedToIssues: issuesListQuery<IMSUser, Issue>("All issues that this the user is assigned to matching (if given) `filterBy`", user => user.assignedToIssuesProperty),
        participantOfIssues: issuesListQuery<IMSUser, Issue>("All issues that this the user is a participant of matching (if given) `filterBy`", user => user.participantOfIssuesProperty),
        issueComments: issueCommentsListQuery<IMSUser, IssueComment>("All issue comments (not including issues) written by this user", user => user.commentsProperty)
    })
};
const GraphQLIMSUser = new GraphQLObjectType(imsUserConfig);
export default GraphQLIMSUser;