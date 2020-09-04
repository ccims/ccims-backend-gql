import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import Element1 from "./Element1";
import { ResolverContext } from "../api/ResolverContext";

class Element2Internal {

}

let e2: GraphQLObjectTypeConfig<Element2Internal, ResolverContext> = {
    name: "Element2",
    fields: () => ({
        elements1: {
            type: Element1
        }
    })
};

let Element2 = new GraphQLObjectType(e2);

export default Element2;