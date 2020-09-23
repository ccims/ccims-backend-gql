CREATE TABLE users
(
    username character varying(100) NOT NULL,
    displayname character varying(200) NOT NULL,
    pw_hash character varying(200) NOT NULL,
    email character varying(320),
    permissions JSON NOT NULL,
    CONSTRAINT unique_username UNIQUE (username),
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE relation_user_project
(
    user_id id NOT NULL,
    project_id id NOT NULL,
    PRIMARY KEY (user_id, project_id)
);