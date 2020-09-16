import { GraphQLObjectType, GraphQLID } from "graphql";
import Element1 from "./Element1";
import Element2 from "./Element2";

const query = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        issue: {
            type: Element1,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve: (parent, args) => {
                return { id: args.id, name: "Issue #" + args.id };
            }
        }
    })
});

export default query;