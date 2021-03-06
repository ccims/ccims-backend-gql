CREATE TABLE ims_system
(
    component_id id,
    type ims_type NOT NULL,
    endpoint text NOT NULL,
    connection_data json NOT NULL,
    PRIMARY KEY (id)
) INHERITS (node);

CREATE TABLE user_ims_credential
(
    id id NOT NULL,
    user_id id NOT NULL,
    ims_id id NOT NULL,
    credentials json NOT NULL,
    PRIMARY KEY (id)
);