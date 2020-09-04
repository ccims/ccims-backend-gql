CREATE TABLE projects
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL
) INHERITS (node);

CREATE TABLE components
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL,
    description character varying(65536) NOT NULL
) INHERITS (node);

CREATE TABLE relation_project_component
(
    project_id id NOT NULL,
    component_id id NOT NULL,
    addad_date timestamp NOT NULL,
    PRIMARY KEY (project_id, component_id)
);

CREATE TABLE relation_component_issues
(
    component_id id NOT NULL,
    issue_id id NOT NULL,
    PRIMARY KEY (component_id, issue_id)
);

CREATE TABLE relation_component_pinnedIssues
(
    component_id id NOT NULL,
    issue_id id NOT NULL,
    PRIMARY KEY (component_id, issue_id)
);

CREATE TABLE relation_component_label 
(
    component_id id NOT NULL,
    label_id id NOT NULL,
    PRIMARY KEY (component_id, label_id)
);

CREATE TABLE component_interfaces
(
    name character varying(256) NOT NULL,
    owner_user_id id NOT NULL,
    description character varying(65536) NOT NULL,
    host_component_id id NOT NULL
) INHERITS (node);

CREATE TABLE relation_componentInterface_issue
(
    component_interface_id id NOT NULL,
    issue_id id NOT NULL,
    PRIMARY KEY (component_interface_id, issue_id)
);