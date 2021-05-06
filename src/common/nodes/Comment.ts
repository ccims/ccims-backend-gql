import { NodeListProperty } from "./properties/NodeListProperty";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { ReactionGroup } from "./ReactionGroup";
import { SyncNode } from "./SyncNode";
import { CommentIssueTimelineItem } from "./timelineItems/CommentIssueTimelineItem";
import { User } from "./User";

/**
 * Interface for all Comments
 * Implementation is eighther Issue or CommentIssueTimelineItem
 */
export interface Comment<T extends Comment = any> extends SyncNode<T> {
    editedByProperty: NodeListProperty<User, CommentIssueTimelineItem>,
    lastEditedByProperty: NullableNodeProperty<User, CommentIssueTimelineItem>,
    reactionsProperty: NodeListProperty<ReactionGroup, CommentIssueTimelineItem>,
    body: string,
    setBody(value: string, atDate: Date, asUser?: User): Promise<void>,
    bodyRendered(): Promise<string>,
    lastEditedAt: Date
}