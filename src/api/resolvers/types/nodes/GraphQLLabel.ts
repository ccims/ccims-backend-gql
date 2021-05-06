import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLColor from "../../scalars/GraphQLColor";
import projectsListQuery from "../../listQueries/projectsListQuery";
import { Label } from "../../../../common/nodes/Label";
import { ResolverContext } from "../../../ResolverContext";
import componentsListQuery from "../../listQueries/componentsListQuery";
import { Component } from "../../../../common/nodes/Component";
import { Project } from "../../../../common/nodes/Project";
import { namedSyncNodeFields } from "./namedSyncNodeFields";

const labelConfig: GraphQLObjectTypeConfig<Label, ResolverContext> = {
    name: "Label",
    description: "A label assignable to issues. A label is per-component",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...namedSyncNodeFields<Label>("Label"),
        color: {
            type: GraphQLNonNull(GraphQLColor),
            description: "The color of the label in the GUI"
        },
        components: componentsListQuery<Label, Component>("The components this label is available on", label => label.componentsProperty),
        projects: projectsListQuery<Label, Project>("All projetcs that this label is used on", label => label.projectsProperty)
    })
};
const GraphQLLabel = new GraphQLObjectType(labelConfig);
export default GraphQLLabel;