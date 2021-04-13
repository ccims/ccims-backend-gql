import { QueryResult, QueryResultRow } from "pg";
import { IMSComponent, IMSComponentTableSpecification } from "../../../../nodes/IMSComponent";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { createStringListFilter } from "./RelationFilter";

export class LoadIMSComponentsCommand extends LoadNodeListCommand<IMSComponent> {

    /**
     * Selects only IMSComponents which have any of the provided components
     */
    public components: string[] | undefined;

    /**
     * Selects only IMSComponents which have any of the povided IMSSystems
     */
    public imsSystems: string[] | undefined;

    /**
     * creates a new LoadIMSComponentsCommand
     */
    public constructor() {
        super(IMSComponentTableSpecification.rows);
    }

    /**
     * parses a IMSComponent
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed IMSComponent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IMSComponent {
        return new IMSComponent(databaseManager, resultRow.id, resultRow.component_id, resultRow.ims_system_id, resultRow.connection_data);
    }

    /**
     * generates the query start
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("ims_system", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.components !== undefined) {
            conditions.conditions.push(createStringListFilter("component_id", this.components, conditions.i, 4));
            conditions.i++;
        }

        if (this.imsSystems !== undefined) {
            conditions.conditions.push(createStringListFilter("ims_system_id", this.imsSystems, conditions.i, 4));
            conditions.i++;
        }

        return conditions;
    }
}