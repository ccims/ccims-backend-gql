import { DatabaseManager } from "../../database/DatabaseManager";
import { Artifact } from "../Artifact";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { ArtifactEvent, ArtifactEventTableSpecification } from "./ArtifactEvent";

export const AddedArtifactEventTableSpecification: NodeTableSpecification<AddedArtifactEvent>
    = new NodeTableSpecification("added_artifact_event", ArtifactEventTableSpecification);

export class AddedArtifactEvent extends ArtifactEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, artifactId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.AddedArtifactEvent, databaseManager, AddedArtifactEventTableSpecification, id,
            createdById, createdAt, issueId, artifactId, isDeleted, lastModifiedAt, metadata);
    }

    /**
     * WARNING: this does NOT add the issue to the specified artifact, but does only create the event
     * this does NOT check if the artifact is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param artifact
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, artifact: Artifact): Promise<AddedArtifactEvent> {
        const event = new AddedArtifactEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, artifact.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async artifact(): Promise<Artifact | undefined> {
        return this.artifactProperty.getPublic();
    }
}