import { DatabaseManager } from "../../database/DatabaseManager";
import { Artifact } from "../Artifact";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { ArtifactEvent, ArtifactEventTableSpecification } from "./ArtifactEvent";

export const RemovedArtifactEventTableSpecification: NodeTableSpecification<RemovedArtifactEvent>
    = new NodeTableSpecification("removed_artifact_event", ArtifactEventTableSpecification);

export class RemovedArtifactEvent extends ArtifactEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, artifactId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.RemovedArtifactEvent, databaseManager, RemovedArtifactEventTableSpecification, id,
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, artifact: Artifact): Promise<RemovedArtifactEvent> {
        const event = new RemovedArtifactEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, artifact.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedArtifact(): Promise<Artifact | undefined> {
        return this.artifactProperty.getPublic();
    }
}