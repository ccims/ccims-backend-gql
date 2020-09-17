import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Issue } from "../Issue";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadataMap, SyncNode, SyncNodeTableSpecification } from "../SyncNode";

/**
* a table specification for a IssueTimelineItem
* does not specifiy the metadata, because this is up to the save method
*/
export const IssueTimelineItemTableSpecification: NodeTableSpecification<IssueTimelineItem>
   = new NodeTableSpecification<IssueTimelineItem>("issue_timelineItem", SyncNodeTableSpecification, 
   new RowSpecification("issue", timelineItem => timelineItem.issueProperty.getId()));

export class IssueTimelineItem<T extends IssueTimelineItem = any> extends SyncNode<T> {

    public readonly issueProperty: NodeProperty<Issue, IssueTimelineItem>;

    private static readonly issuePropertySpecification: NodePropertySpecification<Issue, IssueTimelineItem>
        = new NodePropertySpecification<Issue, IssueTimelineItem>(
            (id, timelineItem) => {
                //TODO
                const command = undefined as any;
                command.ids = [id];
                return command;
            },
            timelineItem => new GetWithReloadCommand(timelineItem, "issue", undefined as any)
            //TODO notifier?
        );


    /**
     * abstract constructor for extending classes
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(type, databaseManager, tableSpecification, id, createdById, createdAt, isDeleted, metadata);
        this.issueProperty = this.registerSaveable(new NodeProperty<Issue, IssueTimelineItem>(databaseManager, IssueTimelineItem.issuePropertySpecification, this, issueId))
    }
}