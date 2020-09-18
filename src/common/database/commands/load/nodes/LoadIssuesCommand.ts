import { QueryResultRow, QueryResult } from "pg";
import { Issue, IssueTableSpecification } from "../../../../nodes/Issue";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";

export class LoadIssuesCommand extends LoadSyncNodeListCommand<Issue> {

    public constructor() {
        super(IssueTableSpecification.rows);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Issue {
        return new Issue(databaseManager, resultRow["id"], resultRow["created_by"], resultRow["created_at"], resultRow["title"], resultRow["is_open"], resultRow["is_duplicate"],
            resultRow["category"], resultRow["start_date"], resultRow["due_date"], resultRow["estimated_time"], resultRow["spent_time"], resultRow["updated_at"],
            resultRow["body_id"], resultRow["deleted"], this.loadWithMetadata ? resultRow["metadata"] : undefined);
    }
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issues main `,
            values: []
        };
    }
    
}