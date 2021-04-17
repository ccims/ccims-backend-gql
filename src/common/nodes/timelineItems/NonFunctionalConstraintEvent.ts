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
    new RowSpecification("non_functional_constraint_id", nonFunctionalConstraintEvent => nonFunctionalConstraintEvent.nonFunctionalConstraintProperty.getId()));

export abstract class NonFunctionalConstraintEvent<T extends NonFunctionalConstraintEvent = any> extends IssueTimelineItem<T> {
    public readonly nonFunctionalConstraintProperty: NullableNodeProperty<NonFunctionalConstraint, NonFunctionalConstraintEvent>;

    private static readonly nonFunctionalConstraintPropertySpecification: NodePropertySpecification<NonFunctionalConstraint, NonFunctionalConstraintEvent>
        = new NodePropertySpecification<NonFunctionalConstraint, NonFunctionalConstraintEvent>(
            (id, nonFunctionalConstraintEvent) => {
                const command = new LoadNonFunctionalConstraintsCommand(true);
                command.ids = [id];
                return command;
            },
            nonFunctionalConstraintEvent => new GetWithReloadCommand(nonFunctionalConstraintEvent, "non_functional_constraint_id", new LoadNonFunctionalConstraintsCommand(true)),
        );

    public constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, nonFunctionalConstraintId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.nonFunctionalConstraintProperty = new NullableNodeProperty<NonFunctionalConstraint, NonFunctionalConstraintEvent>(databaseManager, NonFunctionalConstraintEvent.nonFunctionalConstraintPropertySpecification, this, nonFunctionalConstraintId);
    }
}