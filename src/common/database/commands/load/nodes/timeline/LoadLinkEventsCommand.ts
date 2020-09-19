import { QueryResultRow, QueryResult } from "pg";
import { LinkEvent, LinkEventTableSpecification } from "../../../../../nodes/timelineItems/LinkEvent";
import { DatabaseManager } from "../../../../DatabaseManager";
import { QueryPart } from "../../QueryPart";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

/**
 * command to load AddedToComponentEvents
 */
export class LoadLinkEventsCommand extends LoadIssueTimelineItemsCommandBase<LinkEvent> {

    /**
     * creates a new LoadBodiesCommand
     */
    public constructor() {
        super(LinkEventTableSpecification.rows);
    }

    /**
     * parses a single AddedToComponentEvent
     * @param databaseManager the databaseManager
     * @param resultRow the resultRow
     * @param result the query result
     * @returns the parsed AddedToComponentEvent
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): LinkEvent {
        return new LinkEvent(databaseManager, resultRow.id, resultRow.created_by, resultRow.created_at, resultRow.issue,
           resultRow.old_category, resultRow.linked_issue,
            this.loadWithMetadata ? resultRow.metadata : undefined);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_timeline_linkEvent main `,
            values: []
        };
    }

}