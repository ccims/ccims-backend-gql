import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { User } from "../User";
import { ComponentEvent, ComponentEventTableSpecification } from "./ComponentEvent";

export const PinnedEventTableSpecification: NodeTableSpecification<PinnedEvent>
    = new NodeTableSpecification("issue_timeline_pinned_event", ComponentEventTableSpecification);

export class PinnedEvent extends ComponentEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, componentId: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.PinnedEvent, databaseManager, PinnedEventTableSpecification, id,
            createdById, createdAt, issueId, componentId, isDeleted, metadata);
    }

    /**
     * WARNING: this does NOT add the issue to the specified component, but does only create the event
     * this does NOT check if the component is already added to the issue
     * @param databaseManager
     * @param createdBy
     * @param createdAt
     * @param issue
     * @param component
     */
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, component: Component): Promise<PinnedEvent> {
        const event = new PinnedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, component.id, false);
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async component(): Promise<Component> {
        return this.componentProperty.get();
    }
}