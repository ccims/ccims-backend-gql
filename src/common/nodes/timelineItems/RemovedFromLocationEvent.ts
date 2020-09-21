import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { IssueLocation } from "../IssueLocation";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueLocationEvent, IssueLocationEventTableSpecification } from "./IssueLocationEvent";

export const RemovedFromLocationEventTableSpecification: NodeTableSpecification<RemovedFromLocationEvent>
    = new NodeTableSpecification("issue_timeline_removedFromLocationEvent", IssueLocationEventTableSpecification);

export class RemovedFromLocationEvent extends IssueLocationEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, locationId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.RemovedFromLocationEvent, databaseManager, RemovedFromLocationEventTableSpecification, id,
            createdById, createdAt, issueId, locationId, isDeleted, metadata);
    }

    /**
     * WARNING: this does NOT add the issue to the specified location, but does only create the event
     * this does NOT check if the location is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param location
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, location: IssueLocation): Promise<RemovedFromLocationEvent> {
        const event = new RemovedFromLocationEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, location.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedLocation(): Promise<IssueLocation> {
        return this.issueLocationProperty.get();
    }
}