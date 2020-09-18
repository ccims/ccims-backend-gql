import { Comment } from "../../../../../nodes/timelineItems/Comment";
import { LoadIssueTimelineItemsCommandBase } from "./LoadIssueTimelineItemsCommandBase";

export abstract class LoadCommentsCommandBase<T extends Comment> extends LoadIssueTimelineItemsCommandBase<T> {

}