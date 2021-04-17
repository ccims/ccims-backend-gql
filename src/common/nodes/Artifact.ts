import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { Issue } from "./Issue";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { SyncMetadata } from "./SyncMetadata";
import { SyncNode, SyncNodeTableSpecification } from "./SyncNode";
import { User } from "./User";

/**
 * specifricaton of a table which can contain Artifacts
 */
export const ArtifactTableSpecification: NodeTableSpecification<Artifact>
    = new NodeTableSpecification<Artifact>("artifact", SyncNodeTableSpecification,
        new RowSpecification("component_id", artifact => artifact.componentProperty.getId()),
        RowSpecification.fromProperty("uri", "uri"),
        RowSpecification.fromProperty("line_range_start", "lineRangeStart"),
        RowSpecification.fromProperty("line_range_end", "lineRangeEnd"),
        RowSpecification.fromProperty("last_updated_at", "lastUpdatedAt"));

/**
 * An Artifact is a document on a Component
 */
export class Artifact extends SyncNode<Artifact> {

    /**
     * The URI where the resource is safed
     * It is NOT checked if this is a correct URI
     */
    private _uri: string;

    /**
     * The start of the line range, must be an integer, optional, inclusive
     */
    private _lineRangeStart: number | undefined;

    /**
     * The end of the line range, must be an integer, optional, inclusive
     */
    private _lineRangeEnd: number | undefined;

    /**
     * the date when the NamedNode was last updated (name or description changed)
     */
    private _lastUpdatedAt: Date;

    /**
     * The Component this Artifact is part of
     */
    public readonly componentProperty: NullableNodeProperty<Component, Artifact>;

    /**
     * Specification for the componentProperty
     */
    private static readonly componentPropertySpecification: NodePropertySpecification<Component, Artifact>
        = new NodePropertySpecification<Component, Artifact>(
            (id, node) => {
                const command = new LoadComponentsCommand(true);
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "component_id", new LoadComponentsCommand(true)),
            (component, node) => component.artifactsProperty
        );

    /**
     * Async getter function for the componentProperty
     * @returns A promise of the Component this Artifact is on
     */
    public async component(): Promise<Component | undefined> {
        return this.componentProperty.get();
    }

    
    /**
     * Property with all issues this artifact is assigned
     * do NOT assign an Artifact to an Issue via this property
     */
    public readonly issuesProperty: NodeListProperty<Issue, Artifact>;

    /**
     * Specification for the issuesProperty
     */
    private static readonly issuesPropertySpecification: NodeListPropertySpecification<Issue, Artifact>
        = NodeListPropertySpecification.loadDynamic<Issue, Artifact>(
            LoadRelationCommand.fromSecundary("issue", "artifact"),
            (ids, label) => {
                const command = new LoadIssuesCommand(true);
                command.ids = ids;
                return command;
            },
            (label) => {
                const command = new LoadIssuesCommand(true);
                command.artifacts = [label.id];
                return command;
            })
            .notifyChanged((issue, label) => issue.artifactsProperty)
            .noSave();


    /**
     * Creates an Artifact for an EXISTING artifact from the database
     * DON'T USE TO CREATE A NEW ARTIFACT!!!
     * 
     * @param databaseManager the DatabaseManager for this node
     * @param id the unique id of this node
     * @param componentId the id of the Component this Artifact is part of
     * @param uri the uri associated with the artifact
     * @param lineRangeStart the start of the line range, optional
     * @param lineRangeEnd the end of the line range, optional
     * @param createdById 
     * @param createdById The creator users ID
     * @param createdAt The date the label was created
     * @param isDeleted Weather this label is deleted (needed for sync)
     * @param metadata The metadate of this label for syncing
     */
    public constructor(databaseManager: DatabaseManager, id: string, componentId: string, uri: string, lineRangeStart: number | undefined, lineRangeEnd: number | undefined, lastUpdatedAt: Date,
        createdById: string | undefined, createdAt: Date, isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.Artifact, databaseManager, ArtifactTableSpecification, id, createdById, createdAt, isDeleted, lastModifiedAt, metadata);

        this._uri = uri;
        this._lineRangeStart = lineRangeStart;
        this._lineRangeEnd = lineRangeEnd;
        this._lastUpdatedAt = lastUpdatedAt;
        this.componentProperty = new NullableNodeProperty<Component, Artifact>(databaseManager, Artifact.componentPropertySpecification, this, componentId);
        this.issuesProperty = new NodeListProperty<Issue, Artifact>(databaseManager, Artifact.issuesPropertySpecification, this);
    }

    /**
     * Creates a new label and adds it to the database
     */
    public static async create(databaseManager: DatabaseManager, component: Component, uri: string, lineRangeStart: number | undefined, lineRangeEnd: number | undefined, 
        createdBy: User | undefined, createdAt: Date) {
        if (uri.length > 65536) {
            throw new Error("The provided uri is too long, max = 65536");
        }
        if (lineRangeStart != undefined && !Number.isInteger(lineRangeStart)) {
            throw new Error(`Provided lineRangeStart is not an integer`);
        }
        if (lineRangeEnd != undefined && !Number.isInteger(lineRangeEnd)) {
            throw new Error(`Provided lineRangeEnd is not an integer`);
        }

        const artifact = new Artifact(databaseManager, databaseManager.idGenerator.generateString(), component.id, uri, lineRangeStart, lineRangeEnd, new Date(),
            createdBy?.id, createdAt, false, new Date());
            artifact.markNew();
        databaseManager.addCachedNode(artifact);
        component.artifactsProperty.add(artifact);
        return artifact;
    }

    public get uri(): string {
        return this._uri;
    }

    public setUri(value: string, atDate: Date): void {
        if (value.length > 65536) {
            throw new Error("The provided uri is too long, max = 65536");
        }
        this.markChanged();
        this.lastUpdatedAt = atDate;
        this._uri = value;
    }

    public get lineRangeStart(): number | undefined {
        return this._lineRangeStart;
    }

    public setLineRangeStart(value: number | undefined, atDate: Date): void {
        if (value != undefined && !Number.isInteger(value)) {
            throw new Error(`Provided lineRangeStart is not an integer`);
        }
        this.markChanged();
        this.lastUpdatedAt = atDate
        this._lineRangeStart = value;
    }

    public get lineRangeEnd(): number | undefined {
        return this._lineRangeEnd;
    }

    public setLineRangeEnd(value: number | undefined, atDate: Date): void {
        if (value != undefined && !Number.isInteger(value)) {
            throw new Error(`Provided lineRangeEnd is not an integer`);
        }
        this.markChanged();
        this.lastUpdatedAt = atDate;
        this._lineRangeEnd = value;
    }

    
    /**
     * For all immutable SyncNodes, this is just the creation data
     * all other SyncNodes have to overwrite this to implement correct functionality
     */
    public get lastUpdatedAt(): Date {
        return this._lastUpdatedAt;
    }

    /**
     * Sets lastUpdatedAt if the provided value is greater than the current value
     */
    public set lastUpdatedAt(value: Date) {
        if (this._lastUpdatedAt.getTime() < value.getTime()) {
            this._lastUpdatedAt = value;
            this.markChanged();
        }
    }
}