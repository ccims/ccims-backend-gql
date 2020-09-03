import { GraphQLEnumType } from "graphql";

export default new GraphQLEnumType({
    name: "Priority",
    description: "The Priority which an issue has - how urgent it needs to be resolved",
    values: {
        LOW: {
            value: "LOW",
            description: "The issue has a low priority but higher than issues without priority"
        },
        MEDIUM: {
            value: "MEDIUM",
            description: "The issue has a priority higher than low bot is not absolutely urgent"
        },
        HIGH: {
            value: "HIGH",
            description: "Issues with this priority are __very__ urgent and need to be resolved quickly"
        }
    }
});