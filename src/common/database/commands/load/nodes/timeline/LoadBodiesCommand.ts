import { QueryResultRow, QueryResult } from "pg";
import { Body, BodyTableSpecification } from "../../../../../nodes/timelineItems/Body";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load Bodies
 */
export class LoadBodiesCommand extends LoadIssueTimelineItemsCommandBase<Body> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(BodyTableSpecification.rows);
    }

    /**
     * parses a single body
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed Body
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Body {
        return new Body(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.body, resultRow.last_edited_by, resultRow.last_edited_at, resultRow.initial_title, resultRow.deleted,
            resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_body", databaseManager);
    }

}