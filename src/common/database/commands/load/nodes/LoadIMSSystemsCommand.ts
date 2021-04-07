import { QueryResultRow, QueryResult } from "pg";
import { Adapters } from "../../../../../sync/adapter/SyncAdapters";
import { IMSSystem, IMSSystemTableSpecification } from "../../../../nodes/IMSSystem";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { createStringListFilter } from "./RelationFilter";

/**
 * command to load ImsSystems
 */
export class LoadIMSSystemsCommand extends LoadNodeListCommand<IMSSystem> {

    /**
     * Selects only IMSSystems
     */
    public components?: string[];

    /**
     * creates a new LoadImsSystemsCommand
     */
    public constructor() {
        super(IMSSystemTableSpecification.rows);
    }

    /**
     * parses a imsSystem
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed imsSystem
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IMSSystem {
        return new IMSSystem(databaseManager, resultRow.id, resultRow.component_id, Adapters.adapterById(resultRow.type).tag, resultRow.connection_data);
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

        return conditions;
    }

}