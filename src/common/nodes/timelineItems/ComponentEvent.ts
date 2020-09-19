import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadComponentsCommand } from "../../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodeProperty } from "../properties/NodeProperty";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { SyncMetadataMap } from "../SyncNode";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const ComponentEventTableSpecification: NodeTableSpecification<ComponentEvent>
    = new NodeTableSpecification<ComponentEvent>("issue_timelineItem", IssueTimelineItemTableSpecification,
    new RowSpecification("component", componentEvent => componentEvent.componentProperty.getId()));

export abstract class ComponentEvent<T extends ComponentEvent = any> extends IssueTimelineItem<T> {
    public readonly componentProperty: NodeProperty<Component, ComponentEvent>;

    private static readonly componentPropertySpecification: NodePropertySpecification<Component, ComponentEvent>
        = new NodePropertySpecification<Component, ComponentEvent>(
            (id, componentEvent) => {
                const command = new LoadComponentsCommand();
                command.ids = [id];
                return command;
            },
            componentEvent => new GetWithReloadCommand(componentEvent, "component", new LoadComponentsCommand())
        );

    public constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, componentId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(type, databaseManager, tableSpecification, id,
            createdById, createdAt, issueId, isDeleted, metadata);

        this.componentProperty = new NodeProperty<Component, ComponentEvent>(databaseManager, ComponentEvent.componentPropertySpecification, this, componentId);
    }
}