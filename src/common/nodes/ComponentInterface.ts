import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { NamedNode, NamedNodeTableSpecification } from "./NamedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { IssueLocation, issuesOnLocationPropertySpecification } from "./IssueLocation";
import { Issue } from "./Issue";
import { createJSDocThisTag } from "typescript";

/**
 * the specification of the table which contains components
 */
export const ComponentInterfaceTableSpecification: NodeTableSpecification<ComponentInterface>
    = new NodeTableSpecification<ComponentInterface>("component_interface", NamedNodeTableSpecification,
        new RowSpecification("host_component_id", componentInterface => componentInterface.componentProperty.getId()));

/**
 * a component can have interfaces, which can be locations for issues
 */
export class ComponentInterface extends NamedNode<ComponentInterface> implements IssueLocation {

    /**
     * property for issues which are located on this component
     */
    public readonly issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>;

    /**
     * property on which component this interface is
     */
    public readonly componentProperty: NodeProperty<Component, ComponentInterface>;

    private static readonly componentPropertySpecification: NodePropertySpecification<Component, ComponentInterface>
        = new NodePropertySpecification<Component, ComponentInterface>(
            (id, componentInterface) => {
                const command = new LoadComponentsCommand();
                command.ids = [id];
                return command;
            },
            componentInterface => {
                return new GetWithReloadCommand(componentInterface, "host_component_id", new LoadComponentsCommand());
            },
            (component, componentInterface) => component.interfacesProperty
        );

    /**
     * property with all componentInterfaces of this component
     */
    public readonly consumedByProperty: NodeListProperty<Component, ComponentInterface>;

    /**
     * specification for consumedByProperty
     */
    private static readonly consumedInterfacesPropertySpecification: NodeListPropertySpecification<Component, ComponentInterface>
        = NodeListPropertySpecification.loadDynamic<Component, ComponentInterface>(LoadRelationCommand.fromSecundary("component", "consumedComponentInterface"),
            (ids, componentInterface) => {
                const command = new LoadComponentsCommand();
                command.ids = ids;
                return command;
            },
            componentInterface => {
                const command = new LoadComponentsCommand();
                command.consumesInterface = [componentInterface.id];
                return command;
            })
            .notifyChanged((component, componentInterface) => component.consumedInterfacesProperty)
            .noSave();


    /**
     * abstract constructor for subclasses
     * @param databaseManager the databaseManager 
     * @param id the id of the NamedNode
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, componentId: string) {
        super(NodeType.ComponentInterface, databaseManager, ComponentInterfaceTableSpecification, id, name, description);
        this.componentProperty = new NodeProperty<Component, ComponentInterface>(databaseManager, ComponentInterface.componentPropertySpecification, this, componentId);
        this.consumedByProperty = new NodeListProperty<Component, ComponentInterface>(databaseManager, ComponentInterface.consumedInterfacesPropertySpecification, this);
        this.issuesOnLocationProperty = new NodeListProperty<Issue, IssueLocation>(databaseManager, issuesOnLocationPropertySpecification, this);
    }

}