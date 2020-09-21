INSERT INTO users (id, username, displayname, pw_hash, email, permissions) VALUES ('deleted_0', 'deleted_user', 'Deleted User', '', '', '{}');
INSERT INTO project (id, name, owner_user_id, description) VALUES ('deleted_1', 'Deleted Project', 'deleted_0', 'A Project which was deleted');
INSERT INTO component (id, name, description, owner_user_id, imsSystem_id) VALUES ('deleted_2', 'Deleted Component', 'A Component which was deleted', 'deleted_0', 'deleted_4');
INSERT INTO ims_system (id, component_id, type, endpoint, connection_data) VALUES ('deleted_4', 'deleted_3', 'CCIMS', '', '{}');
INSERT INTO component_interface (id, name, description, host_component_id) VALUES ('deleted_5', 'Deleted ComponentInterface', 'A Component Interface which was deleted', 'deleted_2');
INSERT INTO issue_issue (id, metadata, deleted, created_at, created_by, title, updated_at, is_open, category, body_id) VALUES ('deleted_6', '{"entries":[]}', true, now(), 'deleted_0', 'Deleted Issue', now(), false, 'UNCLASSIFIED', 'deleted_7');
INSERT INTO issue_timeline_body (id, metadata, deleted, created_at, created_by, issue, last_edited_at, last_edited_by, body, initial_title) VALUES ('deleted_7', '{"entries":[]}', true, now(), 'deleted_0', 'deleted_6', now(), 'deleted_0', '', 'Deleted Issue');
INSERT INTO issue_label (id, metadata, deleted, created_at, created_by, name, description, color) VALUES ('deleted_8', '{"entries":[]}', true, now(), 'deleted_0', 'Deleted Label', 'A Label which was deleted', '#FFFFFFFF');

INSERT INTO public.users(
	id, username, displayname, pw_hash, email, permissions)
	VALUES ('0', 'root', 'Root', '', null, '{"global":{"addRemoveProjects":true,"addRemoveComponents":true,"globalAdmin":true},"project":[],"component":[]}');