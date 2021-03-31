CREATE TABLE users (
    username character varying(100),
    displayname character varying(200),
    email character varying(320),
    linked_user id NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE ccims_users (
    pw_hash character varying(200) NOT NULL,
    UNIQUE (username),
    CHECK (username IS NOT NULL),
    PRIMARY KEY (id)
) INHERITS (users);

CREATE TABLE ims_users (
    PRIMARY KEY (id)
) INHERITS (users);

CREATE TABLE roles (
    name varchar(256) NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE global_permissions (
    user_role_id id NOT NULL,
    global_admin boolean NOT NULL DEFAULT false,
    create_delete_projects boolean NOT NULL DEFAULT false,
    create_delete_components boolean NOT NULL DEFAULT false,
    PRIMARY KEY (user_role_id)
);

CREATE TABLE project_permissions (
    user_role_id id NOT NULL,
    project_id id NOT NULL,
    read_project boolean NOT NULL DEFAULT false,
    project_admin boolean NOT NULL DEFAULT false,
    add_remove_components boolean NOT NULL DEFAULT false,
    PRIMARY KEY (user_role_id, project_id)
);

CREATE TABLE component_permissions (
    user_role_id id NOT NULL,
    component_id id NOT NULL,
    read_component boolean NOT NULL DEFAULT false,
    component_admin boolean NOT NULL DEFAULT false,
    edit_issues boolean NOT NULL DEFAULT false,
    moderate boolean NOT NULL DEFAULT false,
    edit_issue_location boolean NOT NULL DEFAULT false,
    change_ims boolean NOT NULL DEFAULT false,
    link_issues boolean NOT NULL DEFAULT false,
    PRIMARY KEY (user_role_id, component_id)
);

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