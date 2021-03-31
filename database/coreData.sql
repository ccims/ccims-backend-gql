INSERT INTO ccims_users (id, username, displayname, pw_hash, email, linked_user) VALUES ('0', 'root', 'Root', '', null, '0');

INSERT INTO global_permissions (user_role_id, global_admin, create_delete_components, create_delete_projects) VALUES ('0', true, true, true);

INSERT INTO roles (id, name) VALUES ('1', 'all_users');