import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { IssueLocation } from "../IssueLocation";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { IssueLocationEvent, IssueLocationEventTableSpecification } from "./IssueLocationEvent";

export const AddedToLocationEventTableSpecification: NodeTableSpecification<AddedToLocationEvent>
    = new NodeTableSpecification("issue_timeline_added_to_location_event", IssueLocationEventTableSpecification);

export class AddedToLocationEvent extends IssueLocationEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, locationId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.AddedToLocationEvent, databaseManager, AddedToLocationEventTableSpecification, id,
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, location: IssueLocation): Promise<AddedToLocationEvent> {
        const event = new AddedToLocationEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, location.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async location(): Promise<IssueLocation> {
        return this.issueLocationProperty.get();
    }
}