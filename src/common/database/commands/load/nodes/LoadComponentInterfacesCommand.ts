import { QueryResultRow, QueryResult } from "pg";
import { SuperCall } from "typescript";
import { ComponentInterface, ComponentInterfaceTableSpecification } from "../../../../nodes/ComponentInterface";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNamedNodesCommand } from "./LoadNamedNodeCommand";
import { createRelationFilterByPrimary, createStringListFilter } from "./RelationFilter";

/**
 * command to load componentInterfaces
 */
export class LoadComponentInterfacesCommand extends LoadNamedNodesCommand<ComponentInterface> {

    /**
     * filter for ComponentInterfaces which are on any of the components
     */
    public onComponents?: string[];

    /**
     * filter for ComponentInterfaces which are consumed by any of the components
     */
    public consumedByComponent?: string[];

    /**
     * creates a new LoadComponentInterfacesCommand
     */
    public constructor() {
        super(ComponentInterfaceTableSpecification.rows);
    }

    /**
     * parses a componentInterface
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed componentInterface
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ComponentInterface {
        return new ComponentInterface(databaseManager, resultRow["id"], resultRow["name"], resultRow["description"], resultRow["host_component_id"]);
    }

    /**
     * generates the queryStart
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM component_interface main `,
            values: []
        }
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onComponents) {
            conditions.conditions.push(createStringListFilter("host_component_id", this.onComponents, conditions.i));
            conditions.i++;
        }
        if (this.consumedByComponent) {
            conditions.conditions.push(createRelationFilterByPrimary("component", "consumedComponentInterface", this.consumedByComponent, conditions.i));
            conditions.i++;
        }

        return conditions;
    }

}