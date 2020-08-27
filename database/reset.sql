-- IMS Tables
DROP TABLE IF EXISTS user_ims_credentials;
DROP TABLE IF EXISTS ims_systems;

-- Project/Component tables
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS components;
DROP TABLE IF EXISTS relation_project_component;
DROP TABLE IF EXISTS relation_component_pinnedIssues;
DROP TABLE IF EXISTS component_interfaces;
DROP TABLE IF EXISTS relation_componentInterface_issue;

-- User Tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS relation_user_project;

-- Issue Tables
DROP TABLE IF EXISTS issue_reactionGroup;
DROP TABLE IF EXISTS issue_timeline_reopenedEvent;
DROP TABLE IF EXISTS issue_timeline_closedEvent;
DROP TABLE IF EXISTS issue_timeline_categoryChangedEvent;
DROP TABLE IF EXISTS issue_timeline_unmarkedAsDuplicateEvent;
DROP TABLE IF EXISTS issue_timeline_markedAsDuplicateEvent;
DROP TABLE IF EXISTS issue_timeline_unassignedEvent;
DROP TABLE IF EXISTS issue_timeline_assignedEvent;
DROP TABLE IF EXISTS issue_timeline_unpinnedEvent;
DROP TABLE IF EXISTS issue_timeline_pinnedEvent;
DROP TABLE IF EXISTS issue_timeline_removedFromComponentEvent;
DROP TABLE IF EXISTS issue_timeline_addedToComponentEvent;
DROP TABLE IF EXISTS issue_timeline_removedFromLocationEvent;
DROP TABLE IF EXISTS issue_timeline_addedToLocationEvent;
DROP TABLE IF EXISTS issue_timeline_estimatedTimeChangedEvent;
DROP TABLE IF EXISTS issue_timeline_dueDateChangedEvent;
DROP TABLE IF EXISTS issue_timeline_startDateChangedEvent;
DROP TABLE IF EXISTS issue_timeline_priorityChangedEvent;
DROP TABLE IF EXISTS issue_timeline_renamedTitleEvent;
DROP TABLE IF EXISTS issue_timeline_unlabledEvent;
DROP TABLE IF EXISTS issue_timeline_labledEvent;
DROP TABLE IF EXISTS issue_timeline_deletedComment;
DROP TABLE IF EXISTS issue_timeline_body;
DROP TABLE IF EXISTS issue_timeline_comment;
DROP TABLE IF EXISTS issue_timeline_unlinkEvent;
DROP TABLE IF EXISTS issue_timeline_linkEvent;
DROP TABLE IF EXISTS issue_timeline_wasUnlinkedEvent;
DROP TABLE IF EXISTS issue_timeline_wasLinkedEvent;
DROP TABLE IF EXISTS issue_timeline_referencedByIssueEvent;
DROP TABLE IF EXISTS issue_timeline_referencedByOtherEvent;
DROP TABLE IF EXISTS issue_timelineItem;
DROP TABLE IF EXISTS syncNode;
DROP TABLE IF EXISTS node;


-- Common
DROP TYPE IF EXISTS issue_type;
DROP TYPE IF EXISTS priority;
DROP TYPE IF EXISTS ims_type;
DROP DOMAIN IF EXISTS id;
