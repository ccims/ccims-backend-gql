import { DatabaseManager } from "../../database/DatabaseManager";
import { Component } from "../Component";
import { Issue } from "../Issue";
import { NodeTableSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadata } from "../SyncMetadata";
import { User } from "../User";
import { ComponentEvent, ComponentEventTableSpecification } from "./ComponentEvent";

export const UnpinnedEventTableSpecification: NodeTableSpecification<UnpinnedEvent>
    = new NodeTableSpecification("unpinned_event", ComponentEventTableSpecification);

export class UnpinnedEvent extends ComponentEvent {

    public constructor (databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, componentId: string,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.UnpinnedEvent, databaseManager, UnpinnedEventTableSpecification, id,
            createdById, createdAt, issueId, componentId, isDeleted, lastModifiedAt, metadata);
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
    public static async create(databaseManager: DatabaseManager, createdBy: User | undefined, createdAt: Date, issue: Issue, component: Component): Promise<UnpinnedEvent> {
        const event = new UnpinnedEvent(databaseManager, databaseManager.idGenerator.generateString(), createdBy?.id, createdAt, issue.id, component.id, false, new Date());
        event.markNew();
        databaseManager.addCachedNode(event);
        await issue.timelineProperty.add(event);
        return event;
    }

    public async component(): Promise<Component | undefined> {
        return this.componentProperty.getPublic();
    }
}