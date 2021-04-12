import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { IMSComponent } from "../../../../common/nodes/IMSComponent";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLNode, { nodeFields } from "../GraphQLNode";
import GraphQLComponent from "./GraphQLComponent";
import GraphQLIMS from "./GraphQLIMS";

const imsConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IMSComponent",
    description: "An component on an ims. For example a single GitHub repository",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...nodeFields<IMSComponent>("IMSComponent"),
        ims: {
            type: GraphQLIMS,
            description: "The IMS which is linked to the Component"
        },
        component: {
            type: GraphQLComponent,
            description: "The component which is linked by the IMS"
        }
    })
};
const GraphQLIMSComponent = new GraphQLObjectType(imsConfig);
export default GraphQLIMSComponent;