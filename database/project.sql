CREATE TABLE project
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL,
    description character varying(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE issue_location (
    name character varying(256) NOT NULL,
    description character varying(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE component
(
    owner_user_id id NOT NULL,
    PRIMARY KEY (id)
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

CREATE TABLE relation_component_pinned_issue
(
    component_id id NOT NULL,
    pinned_issue_id id NOT NULL,
    PRIMARY KEY (component_id, pinned_issue_id)
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

CREATE TABLE relation_issue_location_issue
(
    issue_location_id id NOT NULL,
    issue_id id NOT NULL,
    PRIMARY KEY (issue_location_id, issue_id)
);

CREATE TABLE relation_component_consumed_component_interface
(
    component_id id NOT NULL,
    consumed_component_interface_id id NOT NULL,
    PRIMARY KEY (component_id, consumed_component_interface_id)
);

CREATE TABLE ims_system
(
    component_id id,
    type INT NOT NULL,
    connection_data json NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);