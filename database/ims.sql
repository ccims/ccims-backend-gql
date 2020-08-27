CREATE TABLE user_ims_credentials
(
    id id NOT NULL,
    user_id id NOT NULL,
    ims_id id NOT NULL,
    credentials json NOT NULL,
    PRIMARY KEY (id)
);