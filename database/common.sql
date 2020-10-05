CREATE DOMAIN id AS varchar(32);


CREATE TYPE issue_category AS ENUM ('BUG', 'FEATURE_REQUEST', 'UNCLASSIFIED');
CREATE TYPE priority AS ENUM ('LOW', 'DEFAULT', 'HIGH');
CREATE TYPE ims_type AS ENUM ('GITHUB', 'GITLAB', 'JIRA', 'REDMINE', 'CCIMS');

CREATE TABLE node (
    id id PRIMARY KEY
);

CREATE TABLE sync_node (
    metadata JSON,
    deleted bool NOT NULL DEFAULT false,
    created_at timestamp NOT NULL,
    created_by id NOT NULL
);