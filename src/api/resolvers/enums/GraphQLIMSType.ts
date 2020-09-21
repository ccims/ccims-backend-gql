import { GraphQLEnumType, GraphQLEnumTypeConfig } from "graphql";
import { ImsSystem, ImsType } from "../../../common/nodes/ImsSystem";

const imsTypeConfig: GraphQLEnumTypeConfig = {
    name: "IMSType",
    description: "The type of the Issue management system. Currently only GitHub and ccims internal are available",
    values: {
        CCIMS: {
            value: ImsType.CCIMS,
            description: "The type of the Issue management system. Currently only GitHub and ccims internal are available"
        },
        GITHUB: {
            value: ImsType.GitHub,
            description: "GitHub (or GitHub enterprise server) is the IMS for the component"
        },
        GITLAB: {
            value: ImsType.GitLab,
            description: "Any instance of GitLab is used as issue management system"
        },
        JIRA: {
            value: ImsType.Jira,
            description: "Any instance of Jira is used as issue management system"
        },
        REDMINE: {
            value: ImsType.Redmine,
            description: "Any instance of Redmine is used as issue management system",
        },
    }
};
const GraphQLIMSType = new GraphQLEnumType(imsTypeConfig);
export default GraphQLIMSType;