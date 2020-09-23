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
            value: ImsType.GITHUB,
            description: "GitHub (or GitHub enterprise server) is the IMS for the component"
        },
        GITLAB: {
            value: ImsType.GITLAB,
            description: "Any instance of GitLab is used as issue management system"
        },
        JIRA: {
            value: ImsType.JIRA,
            description: "Any instance of Jira is used as issue management system"
        },
        REDMINE: {
            value: ImsType.REDMINE,
            description: "Any instance of Redmine is used as issue management system",
        },
    }
};
const GraphQLIMSType = new GraphQLEnumType(imsTypeConfig);
export default GraphQLIMSType;