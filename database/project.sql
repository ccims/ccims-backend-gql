CREATE TABLE project
(
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE issue_location (
    LIKE named_sync_node INCLUDING DEFAULTS,
    name varchar(256) NOT NULL,
    description varchar(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE component
(
    repository_url varchar(65536) NOT NULL,
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
    host_component_id id NOT NULL,
    interface_type varchar(65536) NOT NULL,
    PRIMARY KEY (id)
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
    type INT NOT NULL,
    ims_data json NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE ims_component
(
    component_id id NOT NULL,
    ims_system_id id NOT NULL,
    ims_data json NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);