CREATE TABLE users
(
    username character varying(100) NOT NULL,
    displayname character varying(200) NOT NULL,
    pw_hash character varying(200) NOT NULL,
    email character varying(320),
    permissions bytea NOT NULL,
) INHERITS (node);

CREATE TABLE relation_user_project
(
    user_id id NOT NULL,
    project_id id NOT NULL,
    added_date timestamp NOT NULL,
    PRIMARY KEY (user_id, project_id)
);