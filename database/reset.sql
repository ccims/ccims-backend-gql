-- IMS Tables
DROP TABLE IF EXISTS user_ims_credentials;

-- User Tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_projects;

-- Issue Tables
DROP TABLE IF EXISTS Issue_ReactionGroup;
DROP TABLE IF EXISTS Issue_Timeline_ReopenedEvent;
DROP TABLE IF EXISTS Issue_Timeline_ClosedEvent;
DROP TABLE IF EXISTS Issue_Timeline_CategoryChangedEvent;
DROP TABLE IF EXISTS Issue_Timeline_UnmarkedAsDuplicateEvent;
DROP TABLE IF EXISTS Issue_Timeline_MarkedAsDuplicateEvent;
DROP TABLE IF EXISTS Issue_Timeline_UnassignedEvent;
DROP TABLE IF EXISTS Issue_Timeline_AssignedEvent;
DROP TABLE IF EXISTS Issue_Timeline_UnpinnedEvent;
DROP TABLE IF EXISTS Issue_Timeline_PinnedEvent;
DROP TABLE IF EXISTS Issue_Timeline_RemovedFromComponentEvent;
DROP TABLE IF EXISTS Issue_Timeline_AddedToComponentEvent;
DROP TABLE IF EXISTS Issue_Timeline_RemovedFromLocationEvent;
DROP TABLE IF EXISTS Issue_Timeline_AddedToLocationEvent;
DROP TABLE IF EXISTS Issue_Timeline_EstimatedTimeChangedEvent;
DROP TABLE IF EXISTS Issue_Timeline_DueDateChangedEvent;
DROP TABLE IF EXISTS Issue_Timeline_StartDateChangedEvent;
DROP TABLE IF EXISTS Issue_Timeline_PriorityChangedEvent;
DROP TABLE IF EXISTS Issue_Timeline_RenamedTitleEvent;
DROP TABLE IF EXISTS Issue_Timeline_UnlabledEvent;
DROP TABLE IF EXISTS Issue_Timeline_LabledEvent;
DROP TABLE IF EXISTS Issue_Timeline_DeletedComment;
DROP TABLE IF EXISTS Issue_Timeline_Body;
DROP TABLE IF EXISTS Issue_Timeline_Comment;
DROP TABLE IF EXISTS Issue_Timeline_UnlinkEvent;
DROP TABLE IF EXISTS Issue_Timeline_LinkEvent;
DROP TABLE IF EXISTS Issue_Timeline_WasUnlinkedEvent;
DROP TABLE IF EXISTS Issue_Timeline_WasLinkedEvent;
DROP TABLE IF EXISTS Issue_Timeline_ReferencedByIssueEvent;
DROP TABLE IF EXISTS Issue_Timeline_ReferencedByOtherEvent;
DROP TABLE IF EXISTS Issue_TimelineItem;
DROP TABLE IF EXISTS SyncNode;
DROP TABLE IF EXISTS Node;


-- Common
DROP TYPE IF EXISTS issue_type;
DROP TYPE IF EXISTS priority;
DROP DOMAIN IF EXISTS id;
