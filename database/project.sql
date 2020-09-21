CREATE TABLE project
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL,
    description character varying(65536) NOT NULL
) INHERITS (node);

CREATE TABLE issue_location (
    name character varying(256) NOT NULL,
    description character varying(65536) NOT NULL
) INHERITS (node);

CREATE TABLE component
(
    owner_user_id id NOT NULL,
    imsSystem_id id NOT NULL
) INHERITS (issue_location);

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
    host_component_id id NOT NULL
) INHERITS (issue_location);

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
);