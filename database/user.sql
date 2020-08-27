CREATE TABLE users
(
    -- Inherited from table public.node: id id NOT NULL,
    username character varying(100)[] NOT NULL,
    displayname character varying(200)[] NOT NULL,
    pw_hash character varying(200)[] NOT NULL
) INHERITS (public.node);

CREATE TABLE user_projects
(
    user_id id NOT NULL,
    project_id id NOT NULL,
    added_date date NOT NULL,
    PRIMARY KEY (user_id, project_id)
);