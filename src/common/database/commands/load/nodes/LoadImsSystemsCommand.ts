import { QueryResultRow, QueryResult } from "pg";
import { ImsSystem, ImsSystemTableSpecification } from "../../../../nodes/ImsSystem";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load ImsSystems
 */
export class LoadImsSystemsCommand extends LoadNodeListCommand<ImsSystem> {

    /**
     * creates a new LoadImsSystemsCommand
     */
    public constructor() {
        super(ImsSystemTableSpecification.rows);
    }

    /**
     * parses a imsSystem
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed imsSystem
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ImsSystem {
        //TODO add parser for enum
        return new ImsSystem(databaseManager, resultRow["id"], resultRow["ims_type"], resultRow["endpoint"], resultRow["connection_data"], resultRow["component_id"]);
    }

    /**
     * generates the query start
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM ims_system`,
            values: []
        };
    }

}