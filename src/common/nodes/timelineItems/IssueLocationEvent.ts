import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadIssueLocationsCommand } from "../../database/commands/load/nodes/LoadIssueLocationsCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { IssueLocation } from "../IssueLocation";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const IssueLocationEventTableSpecification: NodeTableSpecification<IssueLocationEvent>
    = new NodeTableSpecification<IssueLocationEvent>("issue_timeline_item", IssueTimelineItemTableSpecification,
    new RowSpecification("location_id", issueLocationEvent => issueLocationEvent.issueLocationProperty.getId()));

export abstract class IssueLocationEvent<T extends IssueLocationEvent = any> extends IssueTimelineItem<T> {
    public readonly issueLocationProperty: NullableNodeProperty<IssueLocation, IssueLocationEvent>;

    private static readonly issueLocationPropertySpecification: NodePropertySpecification<IssueLocation, IssueLocationEvent>
        = new NodePropertySpecification<IssueLocation, IssueLocationEvent>(
            (id, issueLocationEvent) => {
                const command = new LoadIssueLocationsCommand(true);
                command.ids = [id];
                return command;
            },
            issueLocationEvent => new GetWithReloadCommand(issueLocationEvent, "location_id", new LoadIssueLocationsCommand(true)),
        );

    public constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, issueLocationId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.issueLocationProperty = new NullableNodeProperty<IssueLocation, IssueLocationEvent>(databaseManager, IssueLocationEvent.issueLocationPropertySpecification, this, issueLocationId);
    }
}