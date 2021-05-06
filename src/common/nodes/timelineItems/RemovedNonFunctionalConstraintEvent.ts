import { DatabaseManager } from "../../database/DatabaseManager";
import { NonFunctionalConstraint } from "../NonFunctionalConstraint";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { NonFunctionalConstraintEvent, NonFunctionalConstraintEventTableSpecification } from "./NonFunctionalConstraintEvent";

export const RemovedNonFunctionalConstraintEventTableSpecification: NodeTableSpecification<RemovedNonFunctionalConstraintEvent>
    = new NodeTableSpecification("removed_non_functional_constraint_event", NonFunctionalConstraintEventTableSpecification);

export class RemovedNonFunctionalConstraintEvent extends NonFunctionalConstraintEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, nonFunctionalConstraintId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.RemovedNonFunctionalConstraintEvent, databaseManager, RemovedNonFunctionalConstraintEventTableSpecification, id,
            createdById, createdAt, issueId, nonFunctionalConstraintId, isDeleted, lastModifiedAt, metadata);
    }

    /**
     * WARNING: this does NOT add the issue to the specified NonFunctionalConstraint, but does only create the event
     * this does NOT check if the NonFunctionalConstraint is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param nonFunctionalConstraint
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, nonFunctionalConstraint: NonFunctionalConstraint): Promise<RemovedNonFunctionalConstraintEvent> {
        const event = new RemovedNonFunctionalConstraintEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, nonFunctionalConstraint.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async removedNonFunctionalConstraint(): Promise<NonFunctionalConstraint | undefined> {
        return this.nonFunctionalConstraintProperty.getPublic();
    }
}