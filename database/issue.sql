CREATE TABLE Issue_TimelineItem (
    LIKE SyncNode,
    issue id NOT NULL,
    created_at timestamp NOT NULL,
    created_by id
) INHERITS (Node);

CREATE TABLE Issue_Timeline_ReferencedByOtherEvent (
    LIKE Issue_TimelineItem,
    source text NOT NULL,
    source_url text NOT NULL,
    component id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_ReferencedByIssueEvent (
    LIKE Issue_TimelineItem,
    mentioned_at_issue id NOT NULL,
    mentioned_in_comment id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_WasLinkedEvent (
    LIKE Issue_TimelineItem,
    linked_by id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_WasUnlinkedEvent (
    Like Issue_TimelineItem,
    unlinked_by id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_LinkEvent (
    LIKE Issue_TimelineItem,
    linked_issue id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_UnlinkEvent (
    LIKE Issue_TimelineItem,
    linked_issue_to_remove id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_Comment (
    LIKE Issue_TimelineItem,
    last_edited_at timestamp,
    edited_by id[],
    body text NOT NULL,
    body_rendered text
    -- reaction???
) INHERITS (Node);

CREATE TABLE Issue_Timeline_DeletedComment (
    LIKE Issue_TimelineItem,
    deleted_by id NOT NULL,
    deleted_at timestamp NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_LabledEvent (
    LIKE Issue_TimelineItem,
    label id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_UnlabledEvent (
    LIKE Issue_TimelineItem,
    label id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_RenamedTitleEvent (
    LIKE Issue_TimelineItem,
    old_title text NOT NULL,
    new_title text NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_PriorityChangedEvent (
    LIKE Issue_TimelineItem,
    old_priority priority,
    new_priority priority
) INHERITS (Node);

CREATE TABLE Issue_Timeline_StartDateChangedEvent (
    LIKE Issue_TimelineItem,
    old_start_date timestamp,
    new_start_date timestamp
) INHERITS (Node);

CREATE TABLE Issue_Timeline_DueDateChangedEvent (
    LIKE Issue_TimelineItem,
    old_due_date timestamp,
    new_due_date timestamp
) INHERITS (Node);

CREATE TABLE Issue_Timeline_EstimatedTimeChangedEvent (
    LIKE Issue_TimelineItem,
    old_estimated_time interval,
    new_estimated_time interval
) INHERITS (Node);

CREATE TABLE Issue_Timeline_AddedToLocationEvent (
    LIKE Issue_TimelineItem,
    location id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_RemovedFromLocationEvent (
    LIKE Issue_TimelineItem,
    removedLocation id NOT NULL 
) INHERITS (Node);

CREATE TABLE Issue_Timeline_AddedToComponentEvent (
    LIKE Issue_TimelineItem,
    component id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_RemovedFromComponentEvent (
    LIKE Issue_TimelineItem,
    removedComponent id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_PinnedEvent (
    Like Issue_TimelineItem
) INHERITS (Node);

CREATE TABLE Issue_Timeline_UnpinnedEvent (
    LIKE Issue_TimelineItem
) INHERITS (Node);

CREATE TABLE Issue_Timeline_AssignedEvent (
    Like Issue_TimelineItem,
    assignee id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_UnassignedEvent (
    LIKE Issue_TimelineItem,
    removedAssignee id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_MarkedAsDuplicateEvent (
    LIKE Issue_TimelineItem,
    original_issue id NOT NULL
) INHERITS (Node);

CREATE TABLE Issue_Timeline_UnmarkedAsDuplicateEvent (
    LIKE Issue_TimelineItem
) INHERITS (Node);

CREATE TABLE Issue_Timeline_CategoryChangedEvent (
    LIKE Issue_TimelineItem,
    old_category issue_type,
    new_category issue_type
) INHERITS (Node);

CREATE TABLE Issue_Timeline_ClosedEvent (
    LIKE Issue_TimelineItem
) INHERITS (Node);

CREATE TABLE Issue_Timeline_ReopenedEvent (
    LIKE Issue_TimelineItem
) INHERITS (Node);

