CREATE TABLE issue_issue (
    LIKE syncNode,
    title varchar(256),
    created_at timestamp NOT NULL,
    created_by id NOT NULL,
    updated_at timestamp NOT NULL,
    is_open bool NOT NULL DEFAULT true,
    is_duplicate bool NOT NULL DEFAULT false,
    category issue_category,
    start_date timestamp,
    due_date timestamp,
    estimated_time interval,
    spent_time interval
) INHERITS (node);

-- relattions for issue --

CREATE TABLE relation_issue_linkedIssue (
    issue_id id NOT NULL,
    linked_issue_id id NOT NULL,
    PRIMARY KEY (issue_id, linked_issue_id)
);

CREATE TABLE relation_issue_assignee (
    issue_id id NOT NULL,
    assignee_id id NOT NULL,
    PRIMARY KEY (issue_id, assignee_id)
);

CREATE TABLE relation_issue_participant (
    issue_id id NOT NULL,
    participant_id id NOT NULL,
    PRIMARY KEY (issue_id, participant_id)
);

CREATE TABLE relation_issue_label (
    issue_id id NOT NULL,
    label_id id NOT NULL,
    PRIMARY KEY (issue_id, label_id)
);

-- end --

CREATE TABLE issue_timelineItem (
    LIKE syncNode,
    issue id NOT NULL,
    created_at timestamp NOT NULL,
    created_by id
) INHERITS (node);

CREATE TABLE issue_timeline_referencedByOtherEvent (
    LIKE issue_timelineItem,
    source text NOT NULL,
    source_url text NOT NULL,
    component id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_referencedByIssueEvent (
    LIKE issue_timelineItem,
    mentioned_at_issue id NOT NULL,
    mentioned_in_comment id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_wasLinkedEvent (
    LIKE issue_timelineItem,
    linked_by id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_wasUnlinkedEvent (
    Like issue_timelineItem,
    unlinked_by id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_linkEvent (
    LIKE issue_timelineItem,
    linked_issue id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_unlinkEvent (
    LIKE issue_timelineItem,
    linked_issue_to_remove id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_comment (
    LIKE issue_timelineItem,
    last_edited_at timestamp,
    edited_by id[],
    body varchar(65536) NOT NULL 
) INHERITS (node);

CREATE TABLE issue_timeline_body (
    LIKE issue_timeline_comment,
    initial_title varchar(256) NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_deletedComment (
    LIKE issue_timelineItem,
    deleted_by id NOT NULL,
    deleted_at timestamp NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_labledEvent (
    LIKE issue_timelineItem,
    label id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_unlabledEvent (
    LIKE issue_timelineItem,
    label id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_renamedTitleEvent (
    LIKE issue_timelineItem,
    old_title varchar(256) NOT NULL,
    new_title varchar(256) NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_priorityChangedEvent (
    LIKE issue_timelineItem,
    old_priority priority,
    new_priority priority
) INHERITS (node);

CREATE TABLE issue_timeline_startDateChangedEvent (
    LIKE issue_timelineItem,
    old_start_date timestamp,
    new_start_date timestamp
) INHERITS (node);

CREATE TABLE issue_timeline_dueDateChangedEvent (
    LIKE issue_timelineItem,
    old_due_date timestamp,
    new_due_date timestamp
) INHERITS (node);

CREATE TABLE issue_timeline_estimatedTimeChangedEvent (
    LIKE issue_timelineItem,
    old_estimated_time interval,
    new_estimated_time interval
) INHERITS (node);

CREATE TABLE issue_timeline_addedToLocationEvent (
    LIKE issue_timelineItem,
    location id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_removedFromLocationEvent (
    LIKE issue_timelineItem,
    removedLocation id NOT NULL 
) INHERITS (node);

CREATE TABLE issue_timeline_addedToComponentEvent (
    LIKE issue_timelineItem,
    component id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_removedFromComponentEvent (
    LIKE issue_timelineItem,
    removedComponent id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_pinnedEvent (
    Like issue_timelineItem
) INHERITS (node);

CREATE TABLE issue_timeline_unpinnedEvent (
    LIKE issue_timelineItem
) INHERITS (node);

CREATE TABLE issue_timeline_assignedEvent (
    Like issue_timelineItem,
    assignee id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_unassignedEvent (
    LIKE issue_timelineItem,
    removedAssignee id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_markedAsDuplicateEvent (
    LIKE issue_timelineItem,
    original_issue id NOT NULL
) INHERITS (node);

CREATE TABLE issue_timeline_unmarkedAsDuplicateEvent (
    LIKE issue_timelineItem
) INHERITS (node);

CREATE TABLE issue_timeline_categoryChangedEvent (
    LIKE issue_timelineItem,
    old_category issue_category,
    new_category issue_category
) INHERITS (node);

CREATE TABLE issue_timeline_closedEvent (
    LIKE issue_timelineItem
) INHERITS (node);

CREATE TABLE issue_timeline_reopenedEvent (
    LIKE issue_timelineItem
) INHERITS (node);

CREATE TABLE issue_reactionGroup (
    LIKE syncNode,
    origin id NOT NULL,
    reaction varchar(100) NOT NULL,
    users id[] NOT NULL
) INHERITS (node);

CREATE TABLE issue_label {
    LIKE syncNode,
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    color varchar(9) NOT NULL,
} INHERITS (node);
