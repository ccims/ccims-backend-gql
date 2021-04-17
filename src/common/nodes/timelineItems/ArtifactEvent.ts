import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadArtifactsCommand } from "../../database/commands/load/nodes/LoadArtifactsCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Artifact } from "../Artifact";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const ArtifactEventTableSpecification: NodeTableSpecification<ArtifactEvent>
    = new NodeTableSpecification<ArtifactEvent>("issue_timeline_item", IssueTimelineItemTableSpecification,
    new RowSpecification("artifact_id", artifactEvent => artifactEvent.artifactProperty.getId()));

export abstract class ArtifactEvent<T extends ArtifactEvent = any> extends IssueTimelineItem<T> {
    public readonly artifactProperty: NullableNodeProperty<Artifact, ArtifactEvent>;

    private static readonly artifactPropertySpecification: NodePropertySpecification<Artifact, ArtifactEvent>
        = new NodePropertySpecification<Artifact, ArtifactEvent>(
            (id, artifactEvent) => {
                const command = new LoadArtifactsCommand(true);
                command.ids = [id];
                return command;
            },
            artifactEvent => new GetWithReloadCommand(artifactEvent, "artifact_id", new LoadArtifactsCommand(true)),
        );

    public constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, artifactId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.artifactProperty = new NullableNodeProperty<Artifact, ArtifactEvent>(databaseManager, ArtifactEvent.artifactPropertySpecification, this, artifactId);
    }
}