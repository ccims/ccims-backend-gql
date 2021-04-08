CREATE TABLE issue (
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

CREATE TABLE referenced_by_other_event (
    LIKE issue_timeline_item,
    source text NOT NULL,
    source_url text NOT NULL,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE referenced_by_issue_event (
    LIKE issue_timeline_item,
    mentioned_at_issue id NOT NULL,
    mentioned_in_comment id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE was_linked_event (
    LIKE issue_timeline_item,
    linked_by id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE was_unlinked_event (
    LIKE issue_timeline_item,
    unlinked_by id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE link_event (
    LIKE issue_timeline_item,
    linked_issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unlink_event (
    LIKE issue_timeline_item,
    linked_issue_to_remove id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE comment (
    LIKE issue_timeline_item,
    last_edited_at timestamp NOT NULL,
    last_edited_by id NOT NULL,
    body varchar(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE body (
    LIKE comment,
    initial_title varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE deleted_comment (
    LIKE issue_timeline_item,
    deleted_by id NOT NULL,
    deleted_at timestamp NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE labelled_event (
    LIKE issue_timeline_item,
    label id NOT NULL
) INHERITS (issue_timeline_item);

CREATE TABLE unlabelled_event (
    LIKE issue_timeline_item,
    label id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE renamed_title_event (
    LIKE issue_timeline_item,
    old_title varchar(256) NOT NULL,
    new_title varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE priority_changed_event (
    LIKE issue_timeline_item,
    old_priority priority,
    new_priority priority,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE start_date_changed_event (
    LIKE issue_timeline_item,
    old_start_date timestamp,
    new_start_date timestamp,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE due_date_changed_event (
    LIKE issue_timeline_item,
    old_due_date timestamp,
    new_due_date timestamp,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE estimated_time_changed_event (
    LIKE issue_timeline_item,
    old_estimated_time interval,
    new_estimated_time interval,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE added_to_location_event (
    LIKE issue_timeline_item,
    location id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE removed_from_location_event (
    LIKE added_to_location_event,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE added_to_component_event (
    LIKE issue_timeline_item,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE removed_from_component_event (
    LIKE added_to_component_event,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE pinned_event (
    Like issue_timeline_item,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unpinned_event (
    LIKE issue_timeline_item,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE assigned_event (
    Like issue_timeline_item,
    assignee id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unassigned_event (
    LIKE issue_timeline_item,
    removed_assignee id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE marked_as_duplicate_event (
    LIKE issue_timeline_item,
    original_issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unmarked_as_duplicate_event (
    LIKE issue_timeline_item,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE category_changed_event (
    LIKE issue_timeline_item,
    old_category issue_category,
    new_category issue_category,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE closed_event (
    LIKE issue_timeline_item,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE reopened_event (
    LIKE issue_timeline_item,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE reaction_group (
    LIKE sync_node,
    origin id NOT NULL,
    reaction varchar(100) NOT NULL,
    users id[] NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE label (
    LIKE sync_node,
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    color varchar(9) NOT NULL,
    PRIMARY KEY (id)
 ) INHERITS (node);
