INSERT INTO public.users(
	id, username, displayname, pw_hash, email, permissions)
	VALUES ('0', 'root', 'Root', '', null, '{"global":{"addRemoveProjects":true,"addRemoveComponents":true,"globalAdmin":true},"project":[],"component":[["5d2b386fc10dc002",{"editIssues":true,"moderate":true,"editIssueLocation":true,"componentAdmin":true,"changeIMS":true}],["5d2b46195e780002",{"editIssues":true,"moderate":true,"editIssueLocation":true,"componentAdmin":true,"changeIMS":true}],["5d2b46955e62c002",{"editIssues":true,"moderate":true,"editIssueLocation":true,"componentAdmin":true,"changeIMS":true}]]}');
	
INSERT INTO public.project(
	id, name, owner_user_id, description)
	VALUES ('1', 'Project1', '0', 'This is a test');
	
INSERT INTO public.relation_user_project(
	user_id, project_id)
	VALUES ('0', '1');
	
INSERT INTO public.component(
	id, name, description, owner_user_id, imssystem_id)
	VALUES ('2', 'Component1', 'A component for testing', '0', '3');
	
INSERT INTO public.ims_system(
	id, component_id, type, endpoint, connection_data)
	VALUES ('3', '2', 'CCIMS', '', '{}');
	
INSERT INTO public.issue_issue(
	id, metadata, deleted, created_at, created_by, title, updated_at, is_open, is_duplicate, category, start_date, due_date, estimated_time, spent_time, body_id, priority)
	VALUES ('4', '{}', false, 'today', '0', 'Husten we ve got an issue', 'today', true, false, 'UNCLASSIFIED', 'today', 'today', 123,456, '5', 'DEFAULT');
	
INSERT INTO public.issue_timeline_body(
	id, metadata, deleted, created_at, created_by, issue, last_edited_at, last_edited_by, body, initial_title)
	VALUES ('5', '{}', false, 'today', '0', '4', 'today', '0', 'One small query for postgres but giant leap for ccims', 'Husten we ve got an issue');
	
INSERT INTO public.issue_issue(
	id, metadata, deleted, created_at, created_by, title, updated_at, is_open, is_duplicate, category, start_date, due_date, estimated_time, spent_time, body_id, priority)
	VALUES ('6', '{}', false, 'today', '0', 'Ground control to major tom', 'today', false, false, 'BUG', 'today', 'today', 111,222, '7', 'DEFAULT');
	
INSERT INTO public.issue_timeline_body(
	id, metadata, deleted, created_at, created_by, issue, last_edited_at, last_edited_by, body, initial_title)
	VALUES ('7', '{}', false, 'today', '0', '4', 'today', '0', 'Ground Control to Major Tom / Ground Control to Major Tom / Take your protein pills and put your helmet on / Ground Control to Major Tom (ten, nine, eight, seven, six) / Commencing countdown, engines on (five, four, three) / Check ignition and may God"s love be with you (two, one, liftoff) / This is Ground Control to Major Tom / You"ve really made the grade / And the papers want to know whose shirts you wear / Now it"s time to leave the capsule if you dare / "This is Major Tom to Ground Control / I"m stepping through the door / And I"m floating in a most peculiar way / And the stars look very different today / For here / Am I sitting in a tin can / Far above the world / Planet Earth is blue / And there"s nothing I can do / Though I"m past one hundred thousand miles / I"m feeling very still / And I think my spaceship knows which way to go / Tell my wife I love her very much she knows / Ground Control to Major Tom / Your circuit"s dead, there"s something wrong / Can you hear me, Major Tom? / Can you hear me, Major Tom? / Can you hear me, Major Tom? / Can you "Here am I floating "round my tin can / Far above the moon / Planet Earth is blue / And there"s nothing I can do"', 'Ground control to major tom');
	
INSERT INTO public.relation_project_component(
	project_id, component_id)
	VALUES ('1', '2');
	
INSERT INTO public.relation_issuelocation_issue(
	issuelocation_id, issue_id)
	VALUES ('2', '4');
	
INSERT INTO public.relation_issue_participant(
	issue_id, participant_id)
	VALUES ('4', '0');
	
INSERT INTO public.relation_issue_linkedissue(
	issue_id, linkedissue_id)
	VALUES ('4', '6');

INSERT INTO public.relation_component_issue(
	component_id, issue_id)
	VALUES ('2', '4');
	
INSERT INTO public.relation_component_issue(
	component_id, issue_id)
	VALUES ('2', '6');
	
INSERT INTO public.relation_comment_editedby(
	comment_id, editedby_id)
	VALUES ('5', '0');
	
INSERT INTO public.relation_comment_editedby(
	comment_id, editedby_id)
	VALUES ('7', '0');