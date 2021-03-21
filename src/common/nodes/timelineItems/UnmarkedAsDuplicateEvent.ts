import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const UnmarkedAsDuplicateEventTableSpecification: NodeTableSpecification<UnmarkedAsDuplicateEvent>
    = new NodeTableSpecification("issue_timeline_unmarked_as_duplicate_event", IssueTimelineItemTableSpecification);

export class UnmarkedAsDuplicateEvent extends IssueTimelineItem {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.UnmarkedAsDuplicateEvent, databaseManager, UnmarkedAsDuplicateEventTableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);
    }

    /**
     * WARNING: this does not modify the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue): Promise<UnmarkedAsDuplicateEvent> {
        const event = new UnmarkedAsDuplicateEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }
}