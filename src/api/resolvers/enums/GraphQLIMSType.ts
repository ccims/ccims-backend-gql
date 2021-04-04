import { GraphQLEnumType, GraphQLEnumTypeConfig } from "graphql";
import { IMSType } from "../../../common/nodes/enums/IMSType";

const imsTypeConfig: GraphQLEnumTypeConfig = {
    name: "IMSType",
    description: "The type of the Issue management system. Currently only GitHub and ccims internal are available",
    values: {
        CCIMS: {
            value: IMSType.CCIMS,
            description: "The type of the Issue management system. Currently only GitHub and ccims internal are available"
        },
        GITHUB: {
            value: IMSType.GITHUB,
            description: "GitHub (or GitHub enterprise server) is the IMS for the component"
        },
        GITLAB: {
            value: IMSType.GITLAB,
            description: "Any instance of GitLab is used as issue management system"
        },
        JIRA: {
            value: IMSType.JIRA,
            description: "Any instance of Jira is used as issue management system"
        },
        REDMINE: {
            value: IMSType.REDMINE,
            description: "Any instance of Redmine is used as issue management system",
        },
    }
};
const GraphQLIMSType = new GraphQLEnumType(imsTypeConfig);
export default GraphQLIMSType;