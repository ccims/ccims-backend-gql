import { DatabaseManager } from "../../database/DatabaseManager";
import { NodeTableSpecification, RowSpecification } from "../NodeTableSpecification";
import { NodeType } from "../NodeType";
import { SyncMetadataMap } from "../SyncNode";
import { Comment, CommentTableSpecification } from "./Comment";

/**
 * a table specification for a Body
 * does not specifiy the metadata, because this is up to the save method
 */
export const BodyTableSpecification: NodeTableSpecification<Body>
   = new NodeTableSpecification<Body>("issue_timeline_body", CommentTableSpecification,
   RowSpecification.fromProperty("initial_title", "initialTitle"));

export class Body extends Comment<Body> {

    private readonly _initialTitle: string;

    /**
     * abstract constructor for extending classes
     * this has no static constructor because it is created with the static constructor of Issue
     * @param type the type of this node
     * @param databaseManager the databaseManager
     * @param tableSpecification the specification of the table which contains this node
     * @param id the id of this node
     * @param lastChangedAt the Date where this node was last changed
     * @param metadata metadata for the sync
     */
    public constructor(databaseManager: DatabaseManager, id: string,
        createdById: string | undefined, createdAt: Date, issueId: string, body: string, lastEditedById: string | undefined, lastEditedAt: Date, initialTitle: string,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.Body, databaseManager, BodyTableSpecification, id, createdById, createdAt, issueId, body, lastEditedById, lastEditedAt, isDeleted, metadata);
        this._initialTitle = initialTitle;
    }

    public get initialTitle(): string {
        return this._initialTitle;
    }

    /**
     * marks this noda as new, and therefore also as changed
     */
    markNew(): void {
        this.markNew();
    }
}