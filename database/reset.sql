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
DROP TRIGGER IF EXISTS insert_ccims_user_trigger ON ccims_users;

-- IMS Tables
DROP TABLE IF EXISTS user_ims_credential;
DROP TABLE IF EXISTS ims_system;

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
DROP TABLE IF EXISTS issue_label;
DROP TABLE IF EXISTS issue_reaction_group;
DROP TABLE IF EXISTS issue_timeline_reopened_event;
DROP TABLE IF EXISTS issue_timeline_closed_event;
DROP TABLE IF EXISTS issue_timeline_category_changed_event;
DROP TABLE IF EXISTS issue_timeline_unmarked_as_duplicate_event;
DROP TABLE IF EXISTS issue_timeline_marked_as_duplicate_event;
DROP TABLE IF EXISTS issue_timeline_unassigned_event;
DROP TABLE IF EXISTS issue_timeline_assigned_event;
DROP TABLE IF EXISTS issue_timeline_unpinned_event;
DROP TABLE IF EXISTS issue_timeline_pinned_event;
DROP TABLE IF EXISTS issue_timeline_removed_from_component_event;
DROP TABLE IF EXISTS issue_timeline_added_to_component_event;
DROP TABLE IF EXISTS issue_timeline_removed_from_location_event;
DROP TABLE IF EXISTS issue_timeline_added_to_location_event;
DROP TABLE IF EXISTS issue_timeline_estimated_time_changed_event;
DROP TABLE IF EXISTS issue_timeline_due_date_changed_event;
DROP TABLE IF EXISTS issue_timeline_start_date_changed_event;
DROP TABLE IF EXISTS issue_timeline_priority_changed_event;
DROP TABLE IF EXISTS issue_timeline_renamed_title_event;
DROP TABLE IF EXISTS issue_timeline_unlabelled_event;
DROP TABLE IF EXISTS issue_timeline_labelled_event;
DROP TABLE IF EXISTS issue_timeline_deleted_comment;
DROP TABLE IF EXISTS issue_timeline_body;
DROP TABLE IF EXISTS issue_timeline_comment;
DROP TABLE IF EXISTS issue_timeline_unlink_event;
DROP TABLE IF EXISTS issue_timeline_link_event;
DROP TABLE IF EXISTS issue_timeline_was_unlinked_event;
DROP TABLE IF EXISTS issue_timeline_was_linked_event;
DROP TABLE IF EXISTS issue_timeline_referenced_by_issue_event;
DROP TABLE IF EXISTS issue_timeline_referenced_by_other_event;
DROP TABLE IF EXISTS issue_timeline_item;
DROP TABLE IF EXISTS relation_issue_label;
DROP TABLE IF EXISTS relation_issue_participant;
DROP TABLE IF EXISTS relation_issue_assignee;
DROP TABLE IF EXISTS relation_issue_linked_issue;
DROP TABLE IF EXISTS relation_comment_edited_by;
DROP TABLE IF EXISTS issue_issue;

-- Common
DROP TABLE IF EXISTS sync_node;
DROP TABLE IF EXISTS node;
DROP TYPE IF EXISTS issue_category;
DROP TYPE IF EXISTS priority;
DROP TYPE IF EXISTS ims_type;
DROP DOMAIN IF EXISTS id;
