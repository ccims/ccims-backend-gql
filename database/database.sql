-- IMS Tables
DROP TABLE IF EXISTS user_ims_credential;
DROP TABLE IF EXISTS ims_system;

-- Project/Component tables
DROP TABLE IF EXISTS relation_component_consumedComponentInterface;
DROP TABLE IF EXISTS relation_component_label;
DROP TABLE IF EXISTS relation_component_issue;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS component;
DROP TABLE IF EXISTS relation_project_component;
DROP TABLE IF EXISTS relation_component_pinnedIssue;
DROP TABLE IF EXISTS component_interface;
DROP TABLE IF EXISTS relation_issueLocation_issue;

-- User Tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS relation_user_project;

-- Issue Tables
DROP TABLE IF EXISTS issue_label;
DROP TABLE IF EXISTS issue_reactionGroup;
DROP TABLE IF EXISTS issue_timeline_reopenedEvent;
DROP TABLE IF EXISTS issue_timeline_closedEvent;
DROP TABLE IF EXISTS issue_timeline_categoryChangedEvent;
DROP TABLE IF EXISTS issue_timeline_unmarkedAsDuplicateEvent;
DROP TABLE IF EXISTS issue_timeline_markedAsDuplicateEvent;
DROP TABLE IF EXISTS issue_timeline_unassignedEvent;
DROP TABLE IF EXISTS issue_timeline_assignedEvent;
DROP TABLE IF EXISTS issue_timeline_unpinnedEvent;
DROP TABLE IF EXISTS issue_timeline_pinnedEvent;
DROP TABLE IF EXISTS issue_timeline_removedFromComponentEvent;
DROP TABLE IF EXISTS issue_timeline_addedToComponentEvent;
DROP TABLE IF EXISTS issue_timeline_removedFromLocationEvent;
DROP TABLE IF EXISTS issue_timeline_addedToLocationEvent;
DROP TABLE IF EXISTS issue_timeline_estimatedTimeChangedEvent;
DROP TABLE IF EXISTS issue_timeline_dueDateChangedEvent;
DROP TABLE IF EXISTS issue_timeline_startDateChangedEvent;
DROP TABLE IF EXISTS issue_timeline_priorityChangedEvent;
DROP TABLE IF EXISTS issue_timeline_renamedTitleEvent;
DROP TABLE IF EXISTS issue_timeline_unlabledEvent;
DROP TABLE IF EXISTS issue_timeline_labledEvent;
DROP TABLE IF EXISTS issue_timeline_deletedComment;
DROP TABLE IF EXISTS issue_timeline_body;
DROP TABLE IF EXISTS issue_timeline_comment;
DROP TABLE IF EXISTS issue_timeline_unlinkEvent;
DROP TABLE IF EXISTS issue_timeline_linkEvent;
DROP TABLE IF EXISTS issue_timeline_wasUnlinkedEvent;
DROP TABLE IF EXISTS issue_timeline_wasLinkedEvent;
DROP TABLE IF EXISTS issue_timeline_referencedByIssueEvent;
DROP TABLE IF EXISTS issue_timeline_referencedByOtherEvent;
DROP TABLE IF EXISTS issue_timelineItem;
DROP TABLE IF EXISTS relation_issue_label;
DROP TABLE IF EXISTS relation_issue_participant;
DROP TABLE IF EXISTS relation_issue_assignee;
DROP TABLE IF EXISTS relation_issue_linkedIssue;
DROP TABLE IF EXISTS issue_issue;

-- Common
DROP TABLE IF EXISTS syncNode;
DROP TABLE IF EXISTS node;
DROP TYPE IF EXISTS issue_category;
DROP TYPE IF EXISTS priority;
DROP TYPE IF EXISTS ims_type;
DROP DOMAIN IF EXISTS id;
CREATE DOMAIN id AS varchar(32);


CREATE TYPE issue_category AS ENUM ('Bug', 'FeatureRequest', 'General');
CREATE TYPE priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE ims_type AS ENUM ('GitHub', 'GitLab', 'Jira', 'Redmine');

CREATE TABLE node (
    id id PRIMARY KEY
);

CREATE TABLE syncNode (
    metadata JSON,
    deleted bool NOT NULL DEFAULT false
);CREATE TABLE issue_issue (
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
    linkedIssue_id id NOT NULL,
    PRIMARY KEY (issue_id, linkedIssue_id)
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
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_referencedByIssueEvent (
    LIKE issue_timelineItem,
    mentioned_at_issue id NOT NULL,
    mentioned_in_comment id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_wasLinkedEvent (
    LIKE issue_timelineItem,
    linked_by id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_wasUnlinkedEvent (
    Like issue_timelineItem,
    unlinked_by id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_linkEvent (
    LIKE issue_timelineItem,
    linked_issue id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_unlinkEvent (
    LIKE issue_timelineItem,
    linked_issue_to_remove id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_comment (
    LIKE issue_timelineItem,
    last_edited_at timestamp,
    edited_by id[],
    body varchar(65536) NOT NULL 
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_body (
    LIKE issue_timeline_comment,
    initial_title varchar(256) NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_deletedComment (
    LIKE issue_timelineItem,
    deleted_by id NOT NULL,
    deleted_at timestamp NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_labledEvent (
    LIKE issue_timelineItem,
    label id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_unlabledEvent (
    LIKE issue_timelineItem,
    label id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_renamedTitleEvent (
    LIKE issue_timelineItem,
    old_title varchar(256) NOT NULL,
    new_title varchar(256) NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_priorityChangedEvent (
    LIKE issue_timelineItem,
    old_priority priority,
    new_priority priority
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_startDateChangedEvent (
    LIKE issue_timelineItem,
    old_start_date timestamp,
    new_start_date timestamp
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_dueDateChangedEvent (
    LIKE issue_timelineItem,
    old_due_date timestamp,
    new_due_date timestamp
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_estimatedTimeChangedEvent (
    LIKE issue_timelineItem,
    old_estimated_time interval,
    new_estimated_time interval
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_addedToLocationEvent (
    LIKE issue_timelineItem,
    location id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_removedFromLocationEvent (
    LIKE issue_timelineItem,
    removedLocation id NOT NULL 
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_addedToComponentEvent (
    LIKE issue_timelineItem,
    component id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_removedFromComponentEvent (
    LIKE issue_timelineItem,
    removedComponent id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_pinnedEvent (
    Like issue_timelineItem
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_unpinnedEvent (
    LIKE issue_timelineItem
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_assignedEvent (
    Like issue_timelineItem,
    assignee id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_unassignedEvent (
    LIKE issue_timelineItem,
    removedAssignee id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_markedAsDuplicateEvent (
    LIKE issue_timelineItem,
    original_issue id NOT NULL
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_unmarkedAsDuplicateEvent (
    LIKE issue_timelineItem
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_categoryChangedEvent (
    LIKE issue_timelineItem,
    old_category issue_category,
    new_category issue_category
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_closedEvent (
    LIKE issue_timelineItem
) INHERITS (issue_timelineItem);

CREATE TABLE issue_timeline_reopenedEvent (
    LIKE issue_timelineItem
) INHERITS (issue_timelineItem);

CREATE TABLE issue_reactionGroup (
    LIKE syncNode,
    origin id NOT NULL,
    reaction varchar(100) NOT NULL,
    users id[] NOT NULL
) INHERITS (node);

CREATE TABLE issue_label (
    LIKE syncNode,
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    color varchar(9) NOT NULL
 ) INHERITS (node);
CREATE TABLE users
(
    username character varying(100) NOT NULL,
    displayname character varying(200) NOT NULL,
    pw_hash character varying(200) NOT NULL,
    email character varying(320),
    permissions JSON NOT NULL
) INHERITS (node);

CREATE TABLE relation_user_project
(
    user_id id NOT NULL,
    project_id id NOT NULL,
    added_date timestamp NOT NULL,
    PRIMARY KEY (user_id, project_id)
);CREATE TABLE project
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL,
    description character varying(65536) NOT NULL
) INHERITS (node);

CREATE TABLE component
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL,
    description character varying(65536) NOT NULL,
    imsSystem_id id NOT NULL
) INHERITS (node);

CREATE TABLE relation_project_component
(
    project_id id NOT NULL,
    component_id id NOT NULL,
    PRIMARY KEY (project_id, component_id)
);

CREATE TABLE relation_component_issue
(
    component_id id NOT NULL,
    issue_id id NOT NULL,
    PRIMARY KEY (component_id, issue_id)
);

CREATE TABLE relation_component_pinnedIssue
(
    component_id id NOT NULL,
    pinnedIssue_id id NOT NULL,
    PRIMARY KEY (component_id, pinnedIssue_id)
);

CREATE TABLE relation_component_label 
(
    component_id id NOT NULL,
    label_id id NOT NULL,
    PRIMARY KEY (component_id, label_id)
);

CREATE TABLE component_interface
(
    name character varying(256) NOT NULL,
    description character varying(65536) NOT NULL,
    host_component_id id NOT NULL
) INHERITS (node);

CREATE TABLE relation_issueLocation_issue
(
    issueLocation_id id NOT NULL,
    issue_id id NOT NULL,
    PRIMARY KEY (issueLocation_id, issue_id)
);

CREATE TABLE relation_component_consumedComponentInterface
(
    component_id id NOT NULL,
    consumedComponentInterface_id id NOT NULL,
    PRIMARY KEY (component_id, consumedComponentInterface_id)
);CREATE TABLE ims_system
(
    component_id id NOT NULL,
    type ims_type NOT NULL,
    endpoint text NOT NULL,
    connection_data json NOT NULL
) INHERITS (node);

CREATE TABLE user_ims_credential
(
    id id NOT NULL,
    user_id id NOT NULL,
    ims_id id NOT NULL,
    credentials json NOT NULL,
    PRIMARY KEY (id)
);