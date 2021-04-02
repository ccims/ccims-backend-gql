import { QueryResultRow, QueryResult } from "pg";
import { DeletedIssueComment, DeletedIssueCommentTableSpecification } from "../../../../../nodes/timelineItems/DeletedIssueComment";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load DeletedIssueComments
 */
export class LoadDeletedIssueCommentsCommand extends LoadIssueTimelineItemsCommandBase<DeletedIssueComment> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(DeletedIssueCommentTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a single DeletedIssueComment
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed DeletedIssueComment
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): DeletedIssueComment {
        return new DeletedIssueComment(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.deleted_by, resultRow.deleted_at, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("issue_timeline_deleted_issue_comment", databaseManager);
    }

}