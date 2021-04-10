-- Triggers and functions
DROP FUNCTION IF EXISTS update_last_modified_at_function;
DROP FUNCTION IF EXISTS insert_ccims_user_function;

DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'last_modified_at'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_last_modified_at_trigger ON %I', t_name);
    END LOOP;
END;
$$ language 'plpgsql';
DROP TRIGGER IF EXISTS insert_ccims_user_trigger ON ccims_user;

-- IMS Tables
DROP TABLE IF EXISTS ims_system;
DROP TABLE IF EXISTS ims_component;

-- Project/_component tables
DROP TABLE IF EXISTS relation_component_consumed_component_interface;
DROP TABLE IF EXISTS relation_component_label;
DROP TABLE IF EXISTS relation_component_issue;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS component;
DROP TABLE IF EXISTS relation_project_component;
DROP TABLE IF EXISTS relation_component_pinned_issue;
DROP TABLE IF EXISTS component_interface;
DROP TABLE IF EXISTS relation_issue_location_issue;
DROP TABLE IF EXISTS issue_location;

-- User Tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ccims_user;
DROP TABLE IF EXISTS ims_user;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS global_permission;
DROP TABLE IF EXISTS project_permission;
DROP TABLE IF EXISTS component_permission;
DROP TABLE IF EXISTS relation_user_project;
DROP TABLE IF EXISTS relation_user_role;

-- Issue Tables
DROP TABLE IF EXISTS label;
DROP TABLE IF EXISTS artifact;
DROP TABLE IF EXISTS non_functional_constraint;
DROP TABLE IF EXISTS reaction_group;
DROP TABLE IF EXISTS reopened_event;
DROP TABLE IF EXISTS closed_event;
DROP TABLE IF EXISTS category_changed_event;
DROP TABLE IF EXISTS unmarked_as_duplicate_event;
DROP TABLE IF EXISTS marked_as_duplicate_event;
DROP TABLE IF EXISTS unassigned_event;
DROP TABLE IF EXISTS assigned_event;
DROP TABLE IF EXISTS unpinned_event;
DROP TABLE IF EXISTS pinned_event;
DROP TABLE IF EXISTS removed_from_component_event;
DROP TABLE IF EXISTS added_to_component_event;
DROP TABLE IF EXISTS removed_from_location_event;
DROP TABLE IF EXISTS added_to_location_event;
DROP TABLE IF EXISTS estimated_time_changed_event;
DROP TABLE IF EXISTS due_date_changed_event;
DROP TABLE IF EXISTS start_date_changed_event;
DROP TABLE IF EXISTS priority_changed_event;
DROP TABLE IF EXISTS renamed_title_event;
DROP TABLE IF EXISTS unlabelled_event;
DROP TABLE IF EXISTS labelled_event;
DROP TABLE IF EXISTS deleted_comment;
DROP TABLE IF EXISTS body;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS unlink_event;
DROP TABLE IF EXISTS link_event;
DROP TABLE IF EXISTS was_unlinked_event;
DROP TABLE IF EXISTS was_linked_event;
DROP TABLE IF EXISTS referenced_by_issue_event;
DROP TABLE IF EXISTS referenced_by_other_event;
DROP TABLE IF EXISTS added_artifact_event;
DROP TABLE IF EXISTS removed_artifact_event;
DROP TABLE IF EXISTS added_non_functional_constraint_event;
DROP TABLE IF EXISTS removed_non_functional_constraint_event;
DROP TABLE IF EXISTS issue_timeline_item;
DROP TABLE IF EXISTS relation_issue_label;
DROP TABLE IF EXISTS relation_issue_participant;
DROP TABLE IF EXISTS relation_issue_assignee;
DROP TABLE IF EXISTS relation_issue_linked_issue;
DROP TABLE IF EXISTS relation_comment_edited_by;
DROP TABLE IF EXISTS relation_issue_artifact;
DROP TABLE IF EXISTS issue;

-- Common
DROP TABLE IF EXISTS sync_node;
DROP TABLE IF EXISTS node;
DROP TYPE IF EXISTS issue_category;
DROP TYPE IF EXISTS priority;
DROP DOMAIN IF EXISTS id;
