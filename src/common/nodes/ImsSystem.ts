import { Connection } from "pg";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Component } from "./Component";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";

export enum ImsType {
    GitHub = "GitHub",
    GitLab = "GitLab",
    Jira = "Jira",
    Redmine = "Redmine"
}

export interface ConnectionData {

}

export const ImsSystemTableSpecification: NodeTableSpecification<ImsSystem>
    = new NodeTableSpecification<ImsSystem>("ims_system", CCIMSNodeTableSpecification,
    RowSpecification.fromProperty("ims_type", "imsType"),
    RowSpecification.fromProperty("endpoint", "endpoint"),
    RowSpecification.fromProperty("connection_data", "connectionData"),
    new RowSpecification("component_id", imsSystem => imsSystem.componentProperty.getId()));

export class ImsSystem extends CCIMSNode<ImsSystem> {
    private _imsType: ImsType;

    private _endpoint: string;

    private _connectionData: ConnectionData;

    public componentProperty: NodeProperty<Component, ImsSystem>;

    private static componentPropertySpecification: NodePropertySpecification<Component, ImsSystem>
    = new NodePropertySpecification<Component, ImsSystem>(
        (id, imsSystem) => {
            const command  = new LoadComponentsCommand();
            command.ids = [id];
            return command;
        },
        imsSystem => {
            return new GetWithReloadCommand(imsSystem, "component_id", new LoadComponentsCommand());
        },
        (component, imsSystem) => component.imsSystemProperty
    );

    public constructor (databaseManager: DatabaseManager, id: string, imsType: ImsType, endpoint: string, connectionData: ConnectionData, componentId: string) {
        super(NodeType.ImsSystem, databaseManager, ImsSystemTableSpecification, id);
        this._imsType = imsType;
        this._connectionData = connectionData;
        this._endpoint = endpoint;
        this.componentProperty = this.registerSaveable(new NodeProperty<Component, ImsSystem>(databaseManager, ImsSystem.componentPropertySpecification, this, componentId));
    }

    public get imsType(): ImsType {
        return this._imsType;
    }

    public set imsType(value: ImsType) {
        this.markChanged();
        this._imsType = value;
    }

    public get endpoint(): string {
        return this._endpoint;
    }

    public set endpoint(value: string) {
        this.markChanged();
        this._endpoint = value;
    }

    public get connectionData(): ConnectionData {
        return this._connectionData;
    }

    public set connectionData(value: ConnectionData) {
        this.markChanged();
        this._connectionData = this.connectionData;
    }

}