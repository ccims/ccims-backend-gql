import { GraphQLEnumType } from "graphql";

export default new GraphQLEnumType({
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
});