import { QueryConfig, QueryResult } from "pg";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Issue } from "./Issue";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { SyncMetadata } from "./SyncMetadata";
import { SyncNode, SyncNodeTableSpecification } from "./SyncNode";
import { User } from "./User";

/**
 * Table specificatoin for NonFunctionalConstraint
 */
export const NonFunctionalConstraintTableSpecification: NodeTableSpecification<NonFunctionalConstraint>
    = new NodeTableSpecification<NonFunctionalConstraint>("non_functional_constraint", SyncNodeTableSpecification,
        new RowSpecification("issue_id", constraint => constraint.issueProperty.getId()),
        RowSpecification.fromProperty("content", "content"),
        RowSpecification.fromProperty("description", "description"),
        RowSpecification.fromProperty("is_active", "isActive"));

/**
 * A non functional constraint on an issue
 * Is the IssueTimelineItem at the same time
 */
export class NonFunctionalConstraint extends SyncNode<NonFunctionalConstraint> {

    /**
     * The content of the constraint
     */
    private _content: string;

    /**
     * The human readable textual description of the constraint
     */
    private _description: string;

    /**
     * True if the NonFunctionalConstraint is currently on the Issue, otherwise false
     */
    private _isActive: boolean;

    /**
     * property for the issue where this timelineItem is on
     */
    public readonly issueProperty: NodeProperty<Issue, NonFunctionalConstraint>;

    /**
     * specification of issueProperty
     */
    private static readonly issuePropertySpecification: NodePropertySpecification<Issue, NonFunctionalConstraint>
        = new NodePropertySpecification<Issue, NonFunctionalConstraint>(
            (id, timelineItem) => {
                const command = new LoadIssuesCommand(true);
                command.ids = [id];
                return command;
            },
            timelineItem => new GetWithReloadCommand(timelineItem, "issue_id", new LoadIssuesCommand(true)),
            (issue, timelineItem) => issue.nonFunctionalConstraintsProperty
        );

    /**
     * Async property getter for issueProperty
     * @returns A promise of the issue this timeline item belongs to
     */
    public async issue(): Promise<Issue> {
        return this.issueProperty.getPublic();
    }

    /**
     * Creates a NonFunctionalConstraint from data from the database
     * DO NOT USE TO CREATE NEW NON_FUNCTIONAL_CONSTRAINT
     * @param content the content of the NonFunctionalConstraint, this must be unique on the issue
     * @param description the human readable description of the NonFunctionalConstraint
     */
    public constructor(databaseManager: DatabaseManager, id: string, issueId: string, content: string, description: string, isActive: boolean,
        createdById: string | undefined, createdAt: Date, isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.NonFunctionalConstraint, databaseManager, NonFunctionalConstraintTableSpecification, id, createdById, createdAt, isDeleted, lastModifiedAt, metadata);

        this._content = content;
        this._description = description;
        this._isActive = isActive;
        this.issueProperty = new NodeProperty<Issue, NonFunctionalConstraint>(databaseManager, NonFunctionalConstraint.issuePropertySpecification, this, issueId);
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
    public static async create(databaseManager: DatabaseManager, issue: Issue, content: string, description: string,
        createdBy: User | undefined, createdAt: Date): Promise<NonFunctionalConstraint> {
        if (!(await NonFunctionalConstraint.contentAvailable(databaseManager, issue, content))) {
            throw new Error(`There is already a NonFunctionalConstraint with content ${content} on ${issue.id}`);
        }
        const constraint = new NonFunctionalConstraint(databaseManager, databaseManager.idGenerator.generateString(), issue.id, content, description, true,
            createdBy?.id, createdAt, false, new Date());
        constraint.markNew();
        databaseManager.addCachedNode(constraint);
        return constraint;
    }

    /**
     * Checks if the content issue pair is still available
     * @param databaseManager DatabaseManager used to perform the command
     * @param issue the issue on which the NonFunctionalConstraint will be created
     * @param content the content of the NonFunctionalConstraint which should be created
     */
    public static async contentAvailable(databaseManager: DatabaseManager, issue: Issue, content: string): Promise<boolean> {
        const command = new ContentAvailableCommand(issue.id, content);
        databaseManager.addCommand(command);
        await databaseManager.executePendingCommands();
        return command.getResult();
    }


    public get content(): string {
        return this._content;
    }

    public async setContent(value: string, atDate: Date, asUser?: User): Promise<void> {
        this._content = value;
        this.markChanged();
        await (await this.issueProperty.getPublic()).participatedAt(asUser, atDate);
    }

    public get description(): string {
        return this._description;
    }

    public async setDescription(value: string, atDate: Date, asUser?: User): Promise<void> {
        this._content = value;
        this.markChanged();
        await (await this.issueProperty.getPublic()).participatedAt(asUser, atDate);
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    /**
     * Warning: only sets isActive, does not add participant or changes last change
     */
    public set isActive(value: boolean) {
        this._isActive = value;
        this.markChanged();
    }
}

/**
 * Command to check if a specific content issue pair is available
 */
class ContentAvailableCommand extends DatabaseCommand<boolean> {

    /**
     * Creates a new ContentAvailableCommand
     * @param issueId the id of the Issue to check
     * @param content the content to check if it is available
     */
    public constructor(private readonly issueId: string, private readonly content: string) {
        super();
    }

    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "SELECT id from non_functional_constraint WHERE issue_id=$1 AND content=$2",
            values: [this.issueId, this.content]
        };
    }

    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rowCount < 1;
        return [];
    }

}