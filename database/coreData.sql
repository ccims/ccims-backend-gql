INSERT INTO ccims_user (id, username, displayname, pw_hash, email, linked_user_id) VALUES ('0', 'root', 'Root', '', null, '0');

INSERT INTO global_permission (id, authorizable_id, global_admin, create_delete_components, create_delete_projects) VALUES ('3', '0', true, true, true);

INSERT INTO role (id, name, description) VALUES ('1', 'all_users', 'This role is assigned to all users');