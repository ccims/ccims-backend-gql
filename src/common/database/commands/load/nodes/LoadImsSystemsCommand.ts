import { QueryResultRow, QueryResult } from "pg";
import { ImsSystem, ImsSystemTableSpecification } from "../../../../nodes/ImsSystem";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

export class LoadImsSystemsCommand extends LoadNodeListCommand<ImsSystem> {

    public constructor() {
        super(ImsSystemTableSpecification.rows);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ImsSystem {
        //TODO add parser for enum
        return new ImsSystem(databaseManager, resultRow["id"], resultRow["ims_type"], resultRow["endpoint"], resultRow["connection_data"], resultRow["component_id"]);
    }

    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM ims_system`,
            values: []
        };
    }

}