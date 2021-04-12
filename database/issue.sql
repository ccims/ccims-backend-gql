CREATE TABLE issue (
    LIKE sync_node INCLUDING DEFAULTS,
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

CREATE TABLE relation_issue_artifact (
    issue_id id NOT NULL,
    artifact_id id NOT NULL,
    PRIMARY KEY (issue_id, artifact_id)
);

CREATE TABLE relation_issue_non_functional_constraint (
    issue_id id NOT NULL,

    non_functional_constraint_id id NOT NULL,
    PRIMARY KEY (issue_id, non_functional_constraint_id)
);

CREATE TABLE relation_comment_edited_by (
    comment_id id NOT NULL,
    edited_by_id id NOT NULL,
    PRIMARY KEY (comment_id, edited_by_id)
);

-- end --

CREATE TABLE issue_timeline_item (
    LIKE sync_node INCLUDING DEFAULTS,
    issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE referenced_by_other_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    source text NOT NULL,
    source_url text NOT NULL,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE referenced_by_issue_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    mentioned_at_issue id NOT NULL,
    mentioned_in_comment id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE was_linked_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    linked_by id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE was_unlinked_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    unlinked_by id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE link_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    linked_issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unlink_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    linked_issue_to_remove id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE comment (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    last_edited_at timestamp NOT NULL,
    last_edited_by id NOT NULL,
    body varchar(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE body (
    LIKE comment INCLUDING DEFAULTS,
    initial_title varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE deleted_comment (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    deleted_by id NOT NULL,
    deleted_at timestamp NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE labelled_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    label id NOT NULL
) INHERITS (issue_timeline_item);

CREATE TABLE unlabelled_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    label id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE renamed_title_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    old_title varchar(256) NOT NULL,
    new_title varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE priority_changed_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    old_priority priority,
    new_priority priority,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE start_date_changed_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    old_start_date timestamp,
    new_start_date timestamp,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE due_date_changed_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    old_due_date timestamp,
    new_due_date timestamp,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE estimated_time_changed_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    old_estimated_time interval,
    new_estimated_time interval,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE added_to_location_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    location id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE removed_from_location_event (
    LIKE added_to_location_event INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE added_to_component_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE removed_from_component_event (
    LIKE added_to_component_event INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE added_artifact_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    artifact id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE removed_artifact_event (
    LIKE added_artifact_event INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE added_non_functional_constraint_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    non_functional_constraint id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE removed_non_functional_constraint_event (
    LIKE added_non_functional_constraint_event INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE pinned_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unpinned_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    component id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE assigned_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    assignee id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unassigned_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    removed_assignee id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE marked_as_duplicate_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    original_issue id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE unmarked_as_duplicate_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE category_changed_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    old_category issue_category,
    new_category issue_category,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE closed_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE reopened_event (
    LIKE issue_timeline_item INCLUDING DEFAULTS,
    PRIMARY KEY (id)
) INHERITS (issue_timeline_item);

CREATE TABLE reaction_group (
    LIKE sync_node INCLUDING DEFAULTS,
    comment_id id NOT NULL,
    reaction varchar(100) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE relation_reaction_group_user (
    reaction_group_id id NOT NULL,
    user_id id NOT NULL,
    PRIMARY KEY (reaction_group_id, user_id)
);

CREATE TABLE label (
    LIKE sync_node INCLUDING DEFAULTS,
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    color varchar(9) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE artifact (
    LIKE sync_node INCLUDING DEFAULTS,
    component_id id NOT NULL,
    uri varchar(65536) NOT NULL,
    line_range_start int,
    line_range_end int,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE non_functional_constraint (
    LIKE sync_node INCLUDING DEFAULTS,
    issue_id id NOT NULL,
    content varchar(65536) NOT NULL,
    description varchar(65536) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    UNIQUE (issue_id, content),
    PRIMARY KEY (id) 
) INHERITS (node);
