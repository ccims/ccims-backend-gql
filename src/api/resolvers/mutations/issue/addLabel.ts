import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddLabelPayload from "../../types/mutations/payloads/issue/GraphQLAddLabelPayload";
import GraphQLAddLabelInput from "../../types/mutations/inputs/issue/GraphQLAddLabelInput";

let addLabel: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addLabel === undefined) {
        addLabel = {
            type: GraphQLAddLabelPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLAddLabelInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addLabel;
};