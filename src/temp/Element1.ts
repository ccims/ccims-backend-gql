import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import Element2 from "./Element2";
import { ResolverContext } from "../api/ResolverContext";

class Element1Internal {

}

let e1: GraphQLObjectTypeConfig<Element1Internal, ResolverContext> = {
    name: "Element1",
    fields: () => ({
        elements2: {
            type: Element2
        }
    })
};

let Element1 = new GraphQLObjectType(e1);

export default Element1;