import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Artifact } from "../../../../common/nodes/Artifact";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLNode from "../GraphQLNode";
import GraphQLComponent from "./GraphQLComponent";
import { syncNodeFields } from "./syncNodeFields";

const artifactConfig: GraphQLObjectTypeConfig<Artifact, ResolverContext> = {
    name: "Artifact",
    description: "An artifact assignable to issues. An artifact is per-component",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...syncNodeFields<Artifact>("Artifact"),
        component: {
            type: GraphQLComponent,
            description: "The component this Artifact is available on"
        },
        uri: {
            type: GraphQLNonNull(GraphQLString),
            description: "The URI identifying the resource"
        },
        lineRangeStart: {
            type: GraphQLInt,
            description: "The start (inclusive) of the lines range the Artifact refers to, optional (can only be applied to text resources)"
        },
        lineRangeEnd: {
            type: GraphQLInt,
            description: "The end (inclusive) of the lines range the Artifact refers to, optional (can only be applied to text resources)"
        }
    })
};
const GraphQLArtifact = new GraphQLObjectType(artifactConfig);
export default GraphQLArtifact;