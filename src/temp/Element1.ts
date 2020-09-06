import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../api/ResolverContext";

class Element1Internal {

}

let e1: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueMutation",
    fields: () => ({
        setName: {
            type: GraphQLString,
            args: {
                newName: {
                    type: GraphQLString
                }
            },
            resolve: (parent, args) => {
                return "Changed name from \"" + parent.name + "\" to \"" + args.newName + "\"";
            }
        }
    })
};

let Element1 = new GraphQLObjectType(e1);

export default Element1;