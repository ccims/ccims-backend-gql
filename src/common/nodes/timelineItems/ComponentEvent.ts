import { GetWithReloadCommand } from "../../database/commands/GetWithReloadCommand";
import { LoadComponentsCommand } from "../../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { NodePropertySpecification } from "../properties/NodePropertySpecification";
import { NullableNodeProperty } from "../properties/NullableNodeProperty";
import { SyncMetadata } from "../SyncMetadata";
import { IssueTimelineItem, IssueTimelineItemTableSpecification } from "./IssueTimelineItem";

export const ComponentEventTableSpecification: NodeTableSpecification<ComponentEvent>
    = new NodeTableSpecification<ComponentEvent>("issue_timeline_item", IssueTimelineItemTableSpecification,
    new RowSpecification("component_id", componentEvent => componentEvent.componentProperty.getId()));

export abstract class ComponentEvent<T extends ComponentEvent = any> extends IssueTimelineItem<T> {
    public readonly componentProperty: NullableNodeProperty<Component, ComponentEvent>;

    private static readonly componentPropertySpecification: NodePropertySpecification<Component, ComponentEvent>
        = new NodePropertySpecification<Component, ComponentEvent>(
            (id, componentEvent) => {
                const command = new LoadComponentsCommand(true);
                command.ids = [id];
                return command;
            },
            componentEvent => new GetWithReloadCommand(componentEvent, "component_id", new LoadComponentsCommand(true)),
        );

    public constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, componentId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(type, databaseManager, tableSpecification, id,
            createdById, createdAt, issueId, isDeleted, lastModifiedAt, metadata);

        this.componentProperty = new NullableNodeProperty<Component, ComponentEvent>(databaseManager, ComponentEvent.componentPropertySpecification, this, componentId);
    }
}