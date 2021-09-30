import { QueryResultRow, QueryResult } from "pg";
import { Adapters } from "../../../../../sync/adapter/SyncAdapters";
import { IMSSystem, IMSSystemTableSpecification } from "../../../../nodes/IMSSystem";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { createRelationFilterOnMany, createStringListFilter } from "./RelationFilter";

/**
 * command to load ImsSystems
 */
export class LoadIMSSystemsCommand extends LoadNodeListCommand<IMSSystem> {

    /**
     * Selects only IMSSystems which are indirectly linked to at least one of the specified components (via any IMSComponent)
     */
    public components: string[] | undefined;

    /**
     * Selects only IMSSystems which are linked to at least one of the specified IMSComponents
     */
    public imsComponents: string[] | undefined;

    /**
     * creates a new LoadImsSystemsCommand
     */
    public constructor() {
        super(IMSSystemTableSpecification.rows);
    }

    /**
     * parses a IMSSystem
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed IMSSystem
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IMSSystem {
        return new IMSSystem(databaseManager, resultRow.id, Adapters.adapterById(resultRow.type).tag, resultRow.ims_data);
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
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.components !== undefined) {
            if (this.components.length === 1) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT ims_system_id FROM ims_component WHERE component_id=$${conditions.i})`,
                    values: [this.components[0]],
                });
            } else {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT ims_system_id FROM ims_component WHERE component_id=ANY($${conditions.i}))`,
                    values: [this.components],
                });
            }
            conditions.i++;
        }

        if (this.imsComponents !== undefined) {
            conditions.conditions.push(createRelationFilterOnMany("ims_component", "ims_system_id", this.imsComponents, conditions.i));
            conditions.i++;
        }

        return conditions;
    }
}