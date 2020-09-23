import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const ClosedEventTableSpecification: NodeTableSpecification<ClosedEvent>
    = new NodeTableSpecification<ClosedEvent>("issue_timeline_closedEvent", IssueTimelineItemTableSpecification);

export class ClosedEvent extends IssueTimelineItem<ClosedEvent> {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.ClosedEvent, databaseManager, ClosedEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);
    }

    /**
     * WARNING: this does not close the issue!
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue): Promise<ClosedEvent> {
        const event = new ClosedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }
}