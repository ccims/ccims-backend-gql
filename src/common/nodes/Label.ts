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
    public async create(databaseManager: DatabaseManager, name: string, color: Color, createdById: string | undefined, createdAt: Date, description?: string, components?: string[]) {
        if (name.length > 256) {
            throw new Error("The given name is too long");
        }
        if (description && description.length > 65536) {
            throw new Error("the given description name is too long");
        }
        if (!color) {
            throw new Error("The color can't be undefined or null");
        }

        const user = new Label(databaseManager, databaseManager.idGenerator.generateString(), name, description || "", color, createdById, createdAt, false, undefined);
        user.markNew();
        databaseManager.addCachedNode(user);
        if (components && components.length >= 1) {
            const loadComponentCmd = new LoadComponentsCommand();
            loadComponentCmd.ids = components;
            databaseManager.addCommand(loadComponentCmd);
            await databaseManager.executePendingCommands();
            const result = loadComponentCmd.getResult();
            await Promise.all(result.map(component => user.componentsProperty.add(component)));
        }
        return user;
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
    public readonly componentsProperty: NodeListProperty<Component, Label> = undefined as any;

    /**
     * The specificaition for the property of components
     */
    private readonly componentsPropertySpecifiaction: NodeListPropertySpecification<Component, Label> = undefined as any;

    /**
     * A property of projects on which this label is __used__
     */
    public readonly projectsProperty: NodeListProperty<Project, Label> = undefined as any;


    /**
     * The specification for the projects property
     */
    private readonly projectsPropertySpecifiaction: NodeListPropertySpecification<Project, Label> = undefined as any;

}