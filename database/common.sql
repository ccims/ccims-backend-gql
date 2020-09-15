CREATE DOMAIN id AS varchar(32);


CREATE TYPE issue_category AS ENUM ('Bug', 'FeatureRequest', 'General');
CREATE TYPE priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE ims_type AS ENUM ('GitHub', 'GitLab', 'Jira', 'Redmine');

CREATE TABLE node (
    id id PRIMARY KEY
);

CREATE TABLE syncNode (
    metadata JSON,
    deleted bool NOT NULL DEFAULT false
);