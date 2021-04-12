CREATE TABLE users (
    username character varying(100) NOT NULL,
    displayname character varying(200) NOT NULL,
    email character varying(320),
    linked_user_id id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE ccims_user (
    pw_hash character varying(200) NOT NULL,
    UNIQUE (username),
    PRIMARY KEY (id)
) INHERITS (users);

CREATE TABLE ims_user (
    ims_data JSON,
    ims_id id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (users);

CREATE TABLE role (
    name character varying(256) NOT NULL,
    description character varying(65536) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE base_permission (
    authorizable_id id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE global_permission (
    global_admin boolean NOT NULL DEFAULT false,
    create_delete_projects boolean NOT NULL DEFAULT false,
    create_delete_components boolean NOT NULL DEFAULT false,
    UNIQUE (authorizable_id),
    PRIMARY KEY (id)
) INHERITS (base_permission);

CREATE TABLE project_permission (
    project_id id NOT NULL,
    read_project boolean NOT NULL DEFAULT false,
    project_admin boolean NOT NULL DEFAULT false,
    add_remove_components boolean NOT NULL DEFAULT false,
    UNIQUE (authorizable_id, project_id),
    PRIMARY KEY (id)
) INHERITS (base_permission);

CREATE TABLE component_permission (
    component_id id NOT NULL,
    read_component boolean NOT NULL DEFAULT false,
    component_admin boolean NOT NULL DEFAULT false,
    edit_issues boolean NOT NULL DEFAULT false,
    moderate boolean NOT NULL DEFAULT false,
    edit_issue_location boolean NOT NULL DEFAULT false,
    change_ims boolean NOT NULL DEFAULT false,
    link_issues boolean NOT NULL DEFAULT false,
    UNIQUE (authorizable_id, component_id),
    PRIMARY KEY (id)
) INHERITS (base_permission);

CREATE TABLE relation_user_project (
    user_id id NOT NULL,
    project_id id NOT NULL,
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE relation_user_role (
    user_id id NOT NULL,
    role_id id NOT NULL,
    PRIMARY KEY (user_id, role_id)
);