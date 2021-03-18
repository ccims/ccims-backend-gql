INSERT INTO public.users(
	id, username, displayname, pw_hash, email, permissions)
	VALUES ('0', 'root', 'Root', '', null, '{"global":{"addRemoveProjects":true,"addRemoveComponents":true,"globalAdmin":true},"project":[],"component":[]}');