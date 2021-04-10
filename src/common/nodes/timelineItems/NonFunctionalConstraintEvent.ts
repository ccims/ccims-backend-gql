import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadNonFunctionalConstraintsCommand } from "../../database/commands/load/nodes/LoadNonFunctionalConstraintsCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { NonFunctionalConstraint } from "../NonFunctionalConstraint";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const NonFunctionalConstraintEventTableSpecification: NodeTableSpecification<NonFunctionalConstraintEvent>
    = new NodeTableSpecification<NonFunctionalConstraintEvent>("issue_timeline_item", IssueTimelineItemTableSpecification,
    new RowSpecification("nonfunctionalconstraint", nonfunctionalconstraintEvent => nonfunctionalconstraintEvent.nonfunctionalconstraintProperty.getId()));

export abstract class NonFunctionalConstraintEvent<T extends NonFunctionalConstraintEvent = any> extends IssueTimelineItem<T> {
    public readonly nonfunctionalconstraintProperty: NullableNodeProperty<NonFunctionalConstraint, NonFunctionalConstraintEvent>;

    private static readonly nonfunctionalconstraintPropertySpecification: NodePropertySpecification<NonFunctionalConstraint, NonFunctionalConstraintEvent>
        = new NodePropertySpecification<NonFunctionalConstraint, NonFunctionalConstraintEvent>(
            (id, nonfunctionalconstraintEvent) => {
                const command = new LoadNonFunctionalConstraintsCommand(true);
                command.ids = [id];
                return command;
            },
            nonfunctionalconstraintEvent => new GetWithReloadCommand(nonfunctionalconstraintEvent, "nonfunctionalconstraint", new LoadNonFunctionalConstraintsCommand(true)),
        );

    public constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, nonfunctionalconstraintId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.nonfunctionalconstraintProperty = new NullableNodeProperty<NonFunctionalConstraint, NonFunctionalConstraintEvent>(databaseManager, NonFunctionalConstraintEvent.nonfunctionalconstraintPropertySpecification, this, nonfunctionalconstraintId);
    }
}