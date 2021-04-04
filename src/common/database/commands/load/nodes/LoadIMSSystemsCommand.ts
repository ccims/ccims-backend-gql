import { QueryResultRow, QueryResult } from "pg";
import { IMSSystem, IMSSystemTableSpecification } from "../../../../nodes/IMSSystem";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

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
     * parses a imsSystem
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed imsSystem
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IMSSystem {
        return new IMSSystem(databaseManager, resultRow.id, resultRow.type, resultRow.endpoint, resultRow.connection_data, resultRow.component_id);
    }

    /**
     * generates the query start
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("ims_system", databaseManager);
    }

}