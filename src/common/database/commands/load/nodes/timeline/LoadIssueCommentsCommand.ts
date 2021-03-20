import { QueryResultRow, QueryResult } from "pg";
import { IssueComment, IssueCommentTableSpecification } from "../../../../../nodes/timelineItems/IssueComment";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadCommentsCommandBase } from "./LoadCommentsCommandBase";

/**
 * command to load IssueComments
 */
export class LoadIssueCommentsCommand extends LoadCommentsCommandBase<IssueComment> {

    /**
     * creates a new LoadIssueCommentCommand
     */
    public constructor() {
        super(IssueCommentTableSpecification.rows);
    }

    /**
     * parses a single IssueComment
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed IssueComment
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IssueComment {
        return new IssueComment(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
            resultRow.body, resultRow.last_edited_by, resultRow.last_edited_at, resultRow.deleted, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_comment", databaseManager);
    }

}