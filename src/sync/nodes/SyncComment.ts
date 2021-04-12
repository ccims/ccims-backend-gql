import { CommentIssueTimelineItem } from "../../common/nodes/timelineItems/CommentIssueTimelineItem";
import { SyncProperty } from "../properties/SyncProperty";
import { SyncPropertySpecification } from "../properties/SyncPropertySpecification";
import { SyncNodeWrapper } from "./SyncNodeWrapper";

/**
 * Sync wrapper for Comments
 */
export class SyncComment<T extends CommentIssueTimelineItem> extends SyncNodeWrapper<T> {

    /**
     * Specification for the body property
     */
    private static readonly bodyPropertySpecification: SyncPropertySpecification<string, CommentIssueTimelineItem, SyncComment<CommentIssueTimelineItem>> = {
        apply: async (item, node) => {
            await node.node.setBody(item.value, item.atDate ?? new Date(), item.asUser);
            return undefined;
        },
        applyHistoric: async (item, node) => {
            await (await node.node.issueProperty.getPublic()).participatedAt(item.asUser, item.atDate);
            return undefined;
        },
        getCurrentStatus: async node => {
            return {
                lastUpdatedAt: node.node.lastEditedAt,
                currentValue: node.node.body
            };
        }
    }

    /**
     * Property to update the body of the comment
     */
    public readonly bodyProperty: SyncProperty<string, CommentIssueTimelineItem, SyncComment<CommentIssueTimelineItem>>;

    /**
     * Creates a new SyncComment based on the provided T
     * @param node the underlaying node
     */
    public constructor(node: T) {
        super(node);

        this.bodyProperty = this.registerSyncModifiable(new SyncProperty(SyncComment.bodyPropertySpecification, this));
    }
}