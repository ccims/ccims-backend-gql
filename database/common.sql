CREATE DOMAIN id AS varchar(32);


CREATE TYPE issue_category AS ENUM ('BUG', 'FEATURE_REQUEST', 'UNCLASSIFIED');
CREATE TYPE priority AS ENUM ('LOW', 'DEFAULT', 'HIGH');

CREATE TABLE node (
    id id PRIMARY KEY
);

CREATE TABLE sync_node (
    deleted bool NOT NULL DEFAULT false,
    created_at timestamp NOT NULL,
    created_by id NOT NULL,
    last_modified_at timestamp NOT NULL DEFAULT now()
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