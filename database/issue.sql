CREATE TABLE issue_issue (
    LIKE sync_node,
    title varchar(256),
    updated_at timestamp NOT NULL,
    is_open bool NOT NULL DEFAULT true,
    is_duplicate bool NOT NULL DEFAULT false,
    category issue_category NOT NULL,
    start_date timestamp,
    due_date timestamp,
    estimated_time int,
    spent_time int,
    body_id id NOT NULL,
    priority priority NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

-- relattions for issue --

CREATE TABLE relation_issue_linked_issue (
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

CREATE TABLE relation_comment_edited_by (
    comment_id id NOT NULL,
    edited_by_id id NOT NULL,
    PRIMARY KEY (comment_id, edited_by_id)
);

-- end --

CREATE TABLE issue_timeline_item (
    LIKE sync_node,
    issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE issue_timeline_referenced_by_other_event (
    LIKE issue_timeline_item,
    source text NOT NULL,
    source_url text NOT NULL,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_referenced_by_issue_event (
    LIKE issue_timeline_item,
    mentioned_at_issue id NOT NULL,
    mentioned_in_comment id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_was_linked_event (
    LIKE issue_timeline_item,
    linked_by id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_was_unlinked_event (
    LIKE issue_timeline_item,
    unlinked_by id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_link_event (
    LIKE issue_timeline_item,
    linked_issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_unlink_event (
    LIKE issue_timeline_item,
    linked_issue_to_remove id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_comment (
    LIKE issue_timeline_item,
    last_edited_at timestamp NOT NULL,
    last_edited_by id NOT NULL,
    body varchar(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_body (
    LIKE issue_timeline_comment,
    initial_title varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_deleted_comment (
    LIKE issue_timeline_item,
    deleted_by id NOT NULL,
    deleted_at timestamp NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_labelled_event (
    LIKE issue_timeline_item,
    label id NOT NULL
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_unlabelled_event (
    LIKE issue_timeline_item,
    label id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_renamed_title_event (
    LIKE issue_timeline_item,
    old_title varchar(256) NOT NULL,
    new_title varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_priority_changed_event (
    LIKE issue_timeline_item,
    old_priority priority,
    new_priority priority,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_start_date_changed_event (
    LIKE issue_timeline_item,
    old_start_date timestamp,
    new_start_date timestamp,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_due_date_changed_event (
    LIKE issue_timeline_item,
    old_due_date timestamp,
    new_due_date timestamp,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_estimated_time_changed_event (
    LIKE issue_timeline_item,
    old_estimated_time interval,
    new_estimated_time interval,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_added_to_location_event (
    LIKE issue_timeline_item,
    location id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_removed_from_location_event (
    LIKE issue_timeline_added_to_location_event,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_added_to_component_event (
    LIKE issue_timeline_item,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_removed_from_component_event (
    LIKE issue_timeline_added_to_component_event,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_pinned_event (
    Like issue_timeline_item,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_unpinned_event (
    LIKE issue_timeline_item,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_assigned_event (
    Like issue_timeline_item,
    assignee id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_unassigned_event (
    LIKE issue_timeline_item,
    removed_assignee id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_marked_as_duplicate_event (
    LIKE issue_timeline_item,
    original_issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_unmarked_as_duplicate_event (
    LIKE issue_timeline_item,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_category_changed_event (
    LIKE issue_timeline_item,
    old_category issue_category,
    new_category issue_category,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_closed_event (
    LIKE issue_timeline_item,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_timeline_reopened_event (
    LIKE issue_timeline_item,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE issue_reaction_group (
    LIKE sync_node,
    origin id NOT NULL,
    reaction varchar(100) NOT NULL,
    users id[] NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE issue_label (
    LIKE sync_node,
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    color varchar(9) NOT NULL,
    PRIMARY KEY (id)
 ) INHERITS (node);
