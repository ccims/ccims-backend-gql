import { Color } from "../Color";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { NamedSyncNode, NamedSyncNodeTableSpecification } from "./NamedSyncNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { SyncMetadataMap } from "./SyncNode";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { Issue } from "./Issue";
import { User } from "./User";

/**
 * specification of a table which can contain labels
 */
export const LabelTableSpecification: NodeTableSpecification<Label>
    = new NodeTableSpecification<Label>("issue_label", NamedSyncNodeTableSpecification,
        new RowSpecification<Label>("color", (label) => label.color.toString()));

/**
 * Class for issue labels
 */
export class Label extends NamedSyncNode {

    /**
     * The color in which to show the label
     */
    private _color: Color;

    /**
     * Creates a label object for an EXISTING label from database
     *
     * DON'T USE TO CREATE A NEW LABEL!!
     *
     * @param databaseManager The database manager for this node
     * @param id The unique id of this node
     * @param name The display name for this label. Max. 256 characters
     * @param description The description for this label. Max 25536 charactes
     * @param color The color in which to show the label
     * @param createdById The creator users ID
     * @param createdAt The date the label was created
     * @param isDeleted Weather this label is deleted (needed for sync)
     * @param metadata The metadate of this label for syncing
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, color: Color, createdById: string | undefined, createdAt: Date,
        isDeleted: boolean, metadata?: SyncMetadataMap) {
        super(NodeType.Label, databaseManager, LabelTableSpecification, id, name, description, createdById, createdAt, isDeleted, metadata);
        this._color = color;
        this.projectsProperty = new NodeListProperty<Project, Label>(databaseManager, Label.projectsPropertySpecifiaction, this);
        this.componentsProperty = new NodeListProperty<Component, Label>(databaseManager, Label.componentsPropertySpecifiaction, this);
        this.issuesProperty = new NodeListProperty<Issue, Label>(databaseManager, Label.issuesPropertySpecifiaction, this);
    }

    /**
     * Creates a new label and adds it to the database
     *
     * @param databaseManager The database manager to use for saving
     * @param name The name of the label to display in the GUI
     * @param color The color in which to show the label
     * @param createdById The Creator users id
     * @param createdAt The date a which the label was created
     * @param description The labels description
     * @param components A list of component ID to which the label is added immediately after creation
     */
    public static async create(databaseManager: DatabaseManager, name: string, color: Color, createdBy: User, createdAt: Date, description?: string, components?: Component[]) {
        if (name.length > 256) {
            throw new Error("The given name is too long");
        }
        if (description && description.length > 65536) {
            throw new Error("the given description name is too long");
        }
        if (!color) {
            throw new Error("The color can't be undefined or null");
        }

        const label = new Label(databaseManager, databaseManager.idGenerator.generateString(), name, description || "", color, createdBy.id, createdAt, false, undefined);
        label.markNew();
        databaseManager.addCachedNode(label);
        if (components && components.length >= 1) {
            await Promise.all(components.map(async component => {
                await label.componentsProperty.add(component);
                await Promise.all((await component.projectsProperty.getPublicElements()).map(async project => {
                    await project.labelsProperty.add(label);
                }));
            }));
        }
        return label;
    }

    /**
     * The color in which to show the label
     */
    public get color(): Color {
        return this._color;
    }

    /**
     * The color in which to show the label
     */
    public set color(color: Color) {
        if (color === undefined || color === null) {
            throw new Error("The color can't be null or undefined");
        }
        this._color = color;
        this.markChanged();
    }

    /**
     * A property of components on which this label exists
     */
    public readonly componentsProperty: NodeListProperty<Component, Label>;

    /**
     * The specificaition for the property of components
     */
    private static readonly componentsPropertySpecifiaction: NodeListPropertySpecification<Component, Label> =
        NodeListPropertySpecification.loadDynamic<Component, Label>(
            LoadRelationCommand.fromSecundary("component", "label"),
            (ids, label) => {
                const command = new LoadComponentsCommand();
                command.ids = ids;
                return command;
            },
            (label) => {
                const command = new LoadComponentsCommand();
                command.labels = [label.id];
                return command;
            }
        )
            .notifyChanged((component, label) => component.labelsProperty)
            .noSave();

    /**
     * A property of projects on which this label is available on (on components assigned to the project)
     * IT IS __NOT__ POSSIBLE TO ADD A PROJECT TO A LABEL VIA THIS PROPERTY
     */
    public readonly projectsProperty: NodeListProperty<Project, Label>;


    /**
     * The specification for the projects property
     */
    private static readonly projectsPropertySpecifiaction: NodeListPropertySpecification<Project, Label> =
        NodeListPropertySpecification.loadDynamic<Project, Label>(
            label => new LoadProjectIdsCommand(label.id),
            (ids, label) => {
                const command = new LoadProjectsCommand();
                command.ids = ids;
                return command;
            },
            (label) => {
                const command = new LoadProjectsCommand();
                command.labels = [label.id];
                return command;
            }
        )
            .notifyChanged((project, label) => project.labelsProperty)
            .noSave();

    /**
     * A property of issues to which this label is assigned
     * do NOT assign a label to an issue via this property
     */
    public readonly issuesProperty: NodeListProperty<Issue, Label>;

    /**
     * The specificaition for the property of issues
     */
    private static readonly issuesPropertySpecifiaction: NodeListPropertySpecification<Issue, Label> =
        NodeListPropertySpecification.loadDynamic<Issue, Label>(
            LoadRelationCommand.fromSecundary("issue", "label"),
            (ids, label) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                command.loadDeleted = true;
                return command;
            },
            (label) => {
                const command = new LoadIssuesCommand();
                command.labels = [label.id];
                command.loadDeleted = true;
                return command;
            }
        )
            .notifyChanged((issue, label) => issue.labelsProperty)
            .noSave();

}

/**
 * command to laod all ids of labels on a project
 */
class LoadProjectIdsCommand extends DatabaseCommand<string[]> {

    /**
     * creates a new LoadProjectIdsCommand
     * @param labelId the id of the label
     */
    public constructor(private readonly labelId: string) {
        super();
    }

    /**
     * generates the query config
     */
    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "SELECT DISTINCT ON(project_id) project_id FROM relation_project_component WHERE component_id=ANY(SELECT component_id FROM relation_component_label WHERE label_id=$1);",
            values: [this.labelId]
        }
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the query result
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows.map(row => row.project_id);
        return [];
    }

}