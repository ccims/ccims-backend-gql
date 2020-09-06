import { GraphQLEnumType, GraphQLEnumTypeConfig } from "graphql";

let imsTypeConfig: GraphQLEnumTypeConfig = {
    name: "IMSType",
    description: "The type of the Issue management system. Currently only GitHub and ccims internal are available",
    values: {
        CCIMS: {
            value: "CCIMS",
            description: "The type of the Issue management system. Currently only GitHub and ccims internal are available"
        },
        GITHUB: {
            value: "GITHUB",
            description: "GitHub (or GitHub enterprise server) is the IMS for the component"
        }
    }
};
let GraphQLIMSType = new GraphQLEnumType(imsTypeConfig);
export default GraphQLIMSType;