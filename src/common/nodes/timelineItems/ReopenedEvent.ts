import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const ReopenedEventTableSpecification: NodeTableSpecification<ReopenedEvent>
    = new NodeTableSpecification<ReopenedEvent>("issue_timeline_reopened_event", IssueTimelineItemTableSpecification);

export class ReopenedEvent extends IssueTimelineItem<ReopenedEvent> {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.ReopenedEvent, databaseManager, ReopenedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);
    }

    /**
     * WARNING: this does not close the issue!
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue): Promise<ReopenedEvent> {
        const event = new ReopenedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }
}