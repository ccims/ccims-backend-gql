import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { BasePermission, BasePermissionTableSpecification } from "./BasePermission";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Component } from "./Component";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";

/**
 * table specification for ComponentPermission
 */
export const ComponentPermissionTableSpecification: NodeTableSpecification<ComponentPermission>
    = new NodeTableSpecification<ComponentPermission>("component_permission", BasePermissionTableSpecification,
        RowSpecification.fromProperty("edit_issues", "editIssues"),
        RowSpecification.fromProperty("moderate", "moderate"),
        RowSpecification.fromProperty("edit_issue_location", "editIssueLocation"),
        RowSpecification.fromProperty("component_admin", "componentAdmin"),
        RowSpecification.fromProperty("change_ims", "changeIMS"),
        RowSpecification.fromProperty("link_issues", "linkIssues"),
        RowSpecification.fromProperty("read_component", "readComponent"),
        new RowSpecification("component_id", permission => permission.componentProperty.getId()));

/**
 * Component Permission: a permission that is bound to a specific component
 */
export class ComponentPermission extends BasePermission<ComponentPermission> {

    /**
     * `true` iff the user is allowed to create/edit/delete his own issues on this component
     */
    private _editIssues: boolean = false;

    /**
     * `true` iff the user is allowed to edit/delete other users issues on this component
     */
    private _moderate: boolean = false;

    /**
     * `true` iff the user is allowed to change the location of an issue to a location belonging to this component
     * (The component itself or an interfece offered by it)
     */
    private _editIssueLocation: boolean = false;

    /**
     * `true` iff a user is an administrator of this component
     * Add users to this component, manage component permissions, mangage interfaces, delete component)
     */
    private _componentAdmin: boolean = false;

    /**
     * `true` iff the user is allowed to manage the IMS of this compounent (set api token, url, etc.)
     */
    private _changeIMS: boolean = false;

    /**
     * `true` iff a user can link issues within this project
     */
    private _linkIssues: boolean = false;

    /**
     * `true`if a user can read this component
     * this does not grant any write permissions
     */
    private _readComponent: boolean = false;

    /**
     * property for the component for which this permissions grants rights
     */
    public readonly componentProperty: NullableNodeProperty<Component, ComponentPermission>;

    /**
     * specification for componentProperty
     */
    private static readonly componentPropertySpecification: NodePropertySpecification<Component, ComponentPermission>
        = new NodePropertySpecification<Component, ComponentPermission>(
            (id, node) => {
                const command = new LoadComponentsCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "component_id", new LoadComponentsCommand()),
            (component, node) => component.permissionsProperty
        );

    /**
     * Creates a new ComponentsPermission
     */
    public constructor(databaseManager: DatabaseManager, id: string, authorizeableId: string, componentId: string,
        editIssues: boolean, moderate: boolean, editIssueLocation: boolean, componentAdmin: boolean, changeIMS: boolean, linkIssues: boolean, readComponent: boolean) {
        super(NodeType.ComponentPermission, databaseManager, ComponentPermissionTableSpecification, id, authorizeableId);

        this._editIssues = editIssues;
        this._moderate = moderate;
        this._editIssueLocation = editIssueLocation;
        this._componentAdmin = componentAdmin;
        this._changeIMS = changeIMS;
        this._linkIssues = linkIssues;
        this._readComponent = readComponent;
        this.componentProperty = new NullableNodeProperty<Component, ComponentPermission>(databaseManager, ComponentPermission.componentPropertySpecification, this, componentId);
    }

    public get editIssues(): boolean {
        return this._editIssues;
    }

    public set editIssues(value: boolean) {
        this.markChanged();
        this._editIssues = value;
    }

    public get moderate(): boolean {
        return this._moderate;
    }
    
    public set moderate(value: boolean) {
        this.markChanged();
        this._moderate = value;
    }
    
    public get editIssueLocation(): boolean {
        return this._editIssueLocation;
    }
    
    public set editIssueLocation(value: boolean) {
        this.markChanged();
        this._editIssueLocation = value;
    }

    public get componentAdmin(): boolean {
        return this._componentAdmin;
    }
    
    public set componentAdmin(value: boolean) {
        this.markChanged();
        this._componentAdmin = value;
    }

    public get changeIMS(): boolean {
        return this._changeIMS;
    }
    
    public set changeIMS(value: boolean) {
        this.markChanged();
        this._changeIMS = value;
    }

    public get linkIssues(): boolean {
        return this._linkIssues;
    }
    
    public set linkIssues(value: boolean) {
        this.markChanged();
        this._linkIssues = value;
    }

    public get readComponent(): boolean {
        return this._readComponent;
    }
    
    public set readComponent(value: boolean) {
        this.markChanged();
        this._readComponent = value;
    }

    public async markDeleted(): Promise<void> {
        if (!this.isDeleted) {
            await super.markDeleted();
            await this.componentProperty.markDeleted();
        }
    }
}