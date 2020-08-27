CREATE TABLE ims_systems
(
    id id NOT NULL
    component_id id NOT NULL,
    type ims_type NOT NULL,
    endpoint text NOT NULL,
    connection_data json NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_ims_credentials
(
    id id NOT NULL,
    user_id id NOT NULL,
    ims_id id NOT NULL,
    credentials json NOT NULL,
    PRIMARY KEY (id)
);