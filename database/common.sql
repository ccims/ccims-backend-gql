CREATE DOMAIN id AS varchar(32);


CREATE TYPE issue_category AS ENUM ('BUG', 'FEATURE_REQUEST', 'UNCLASSIFIED');
CREATE TYPE priority AS ENUM ('LOW', 'DEFAULT', 'HIGH');

CREATE TABLE node (
    id id PRIMARY KEY
);

CREATE TABLE sync_node (
    LIKE node INCLUDING DEFAULTS,
    deleted bool NOT NULL DEFAULT false,
    created_at timestamp NOT NULL,
    created_by_id id NOT NULL,
    last_modified_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE named_sync_node (
    LIKE sync_node INCLUDING DEFAULTS,
    last_updated_at timestamp NOT NULL
);

CREATE TABLE metadata (
    id id NOT NULL,
    node_id id NOT NULL,
    metadata JSON,
    PRIMARY KEY (id, node_id)
);

CREATE TABLE sync_lookup_table (
    id varchar(128) NOT NULL,
    ims_component_id id NOT NULL,
    ccims_id id,
    PRIMARY KEY (id, ims_component_id)
);