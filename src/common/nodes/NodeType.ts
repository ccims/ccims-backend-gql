/**
 * enum with types for nodes
 */
export enum NodeType {
    User = "User",
    Project = "Project",
    Component = "Component",
    ComponentInterface = "ComponentInterface",
    Issue = "Issue",
    IssueComment = "IssueComment",
    DeletedIssueComment = "DeletedIssueComment",
    ReferencedByOtherEvent = "ReferencedByOtherEvent",
    ReferencedByIssueEvent = "RefenencedByIssueEvent",
    LinkEvent = "LinkEvent",
    UnlinkEvent = "UnlinkEvent",
    WasLinkedEvent = "WasLinkedEvent",
    WasUnlinkedEvent = "WasUnlinkedEvent",
    LabelledEvent = "LabelledEvent",
    UnlabelledEvent = "UnlabelledEvent",
    PinnedEvent = "PinnedEvent",
    UnpinnedEvent = "UnpinnedEvent",
    RenamedTitleEvent = "RenamedTitleEvent",
    CategoryChangedEvent = "CategoryChangedEvent",
    AssignedEvent = "AssignEvent",
    UnassignedEvent = "UnassignedEvent",
    ClosedEvent = "ClosedEvent",
    ReopenedEvent = "ReopenedEvent",
    PriorityChangedEvent = "PriorityChangedEvent",
    StartDateChangedEvent = "StartDateChangedEvent",
    DueDateChangedEvent = "DueDateChangedEvent",
    EstimatedTimeChangedEvent = "EstimatedTimeChangedEvent",
    AddedToLocationEvent = "AddedToLocationEvent",
    RemovedFromLocationEvent = "RemovedFromLocationEvent",
    AddedToComponentEvent = "AddedToComponentEvent",
    RemovedFromComponentEvent = "RemovedFromComponentEvent",
    MarkedAsDuplicateEvent = "MarkedAsDuplicateEvent",
    UnmarkedAsDuplicateEvent = "UnmarkedAsDuplicateEvent",
    ReactionGroup = "ReactionGroup",
    Label = "Label",
    ImsSystem = "ImsSystem",
    Body = "Body"
}