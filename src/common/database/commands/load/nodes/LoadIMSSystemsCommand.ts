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
        return new IMSSystem(databaseManager, resultRow.id, Adapters.adapterById(resultRow.type).tag, resultRow.connection_data);
    }

    /**
     * generates the query start
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("ims_system", databaseManager);
    }

}