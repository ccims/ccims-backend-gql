import { GraphQLEnumType, GraphQLEnumTypeConfig } from "graphql";
import { SyncAdapter } from "../../../sync/adapter/SyncAdapter";
import { Adapters } from "../../../sync/adapter/SyncAdapters";

const imsTypeConfig: GraphQLEnumTypeConfig = {
    name: "IMSType",
    description: "The type of the Issue management system. Currently only GitHub and ccims internal are available",
    values: Adapters.syncAdapters.reduce((items: { [key: string]: { value: string, description: string } }, adapter: SyncAdapter) => {
        items[adapter.tag] = {
            value: adapter.tag,
            description: adapter.description
        };
        return items;
    }, {})
};
const GraphQLIMSType = new GraphQLEnumType(imsTypeConfig);
export default GraphQLIMSType;