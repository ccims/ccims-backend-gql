import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLComponentInterfacePage from "../types/pages/GraphQLComponentInterfacePage";
import GraphQLComponentInterfaceFilter from "../types/filters/GraphQLComponentInterfaceFilter";

let interfaces: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (interfaces === undefined) {
        interfaces = {
            type: GraphQLComponentInterfacePage,
            description: "Requests component interfaces which this component offers",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Returns interfaces after the given edge"
                },
                before: {
                    type: GraphQLString,
                    description: "Returns interfaces before the given edge"
                },
                filterBy: {
                    type: GraphQLComponentInterfaceFilter,
                    description: "Only interfaces matching this filter will be returned"
                },
                first: {
                    type: GraphQLInt,
                    description: "Only return the first _n_ interfaces in the system"
                },
                last: {
                    type: GraphQLInt,
                    description: "Only return the last _n_ interfaces in the system"
                }
            }
        };
    }
    return interfaces;
};