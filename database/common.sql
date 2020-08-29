CREATE DOMAIN id AS BIGINT;


CREATE TYPE issue_category AS ENUM ('Bug', 'FeatureRequest', 'General');
CREATE TYPE priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE ims_type AS ENUM ('GitHub', 'GitLab', 'Jira', 'Redmine');

CREATE TABLE Node (
    id id PRIMARY KEY
);

CREATE TABLE SyncNode (
    metadata: JSON
);