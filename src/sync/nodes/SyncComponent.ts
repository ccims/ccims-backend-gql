import { LoadComponentInterfacesCommand } from "../../common/database/commands/load/nodes/LoadComponentInterfacesCommand";
import { LoadIssuesCommand } from "../../common/database/commands/load/nodes/LoadIssuesCommand";
import { LoadLabelsCommand } from "../../common/database/commands/load/nodes/LoadLabelsCommand";
import { Component } from "../../common/nodes/Component";
import { ComponentInterface } from "../../common/nodes/ComponentInterface";
import { Issue } from "../../common/nodes/Issue";
import { Label } from "../../common/nodes/Label";
import { SyncProperty } from "../properties/SyncProperty";
import { SyncPropertySpecification } from "../properties/SyncPropertySpecification";
import { SyncNodeProvider } from "../providers/SyncNodeProvider";
import { SyncNodeProviderSpecification } from "../providers/SyncNodeProviderSpecification";
import { SyncComponentInterface } from "./SyncComponentInterface";
import { SyncIssue } from "./SyncIssue";
import { SyncLabel } from "./SyncLabel";
import { SyncNamedNode } from "./SyncNamedNode";

/**
 * Sync wrapper for Label
 */
export class SyncComponent extends SyncNamedNode<Component> {

    /**
     * Specification for the repositoryURLProperty
     */
     private static readonly repositoryURLPropertySpecification: SyncPropertySpecification<string, Component, SyncComponent> = {
        apply: async (item, node) => {
            node.node.setRepositoryURL(item.value, item.atDate ?? new Date());
            return undefined;
        },
        applyHistoric: async () => undefined,
        getCurrentStatus: async node => {
            return {
                lastUpdatedAt: node.lastUpdatedAt,
                currentValue: node.node.description
            };
        }
    }

    /**
     * Property to update the repositoryURL of the Component
     */
    public readonly repositoryURLProperty: SyncProperty<string, Component, SyncComponent>;

    /**
     * Specification for the issuesProvider
     */
    private static readonly issuesProviderSpecification: SyncNodeProviderSpecification<Issue, SyncIssue, LoadIssuesCommand> = {
        createWrapper: issue => new SyncIssue(issue),
        createCommand: modifiedSince => {
            const command = new LoadIssuesCommand(true);
            command.issueOrTimelineModifiedSince = modifiedSince;
            return command;
        }
    }

    /**
     * issues property
     */
    public readonly issuesProvider: SyncNodeProvider<Issue, SyncIssue, LoadIssuesCommand>;


    /**
     * Specification for the labelsProvider
     */
    private static readonly labelsProviderSpecification: SyncNodeProviderSpecification<Label, SyncLabel, LoadLabelsCommand> = {
        createWrapper: label => new SyncLabel(label),
        createCommand: modifiedSince => {
            const command = new LoadLabelsCommand(true);
            command.modifiedSince = modifiedSince;
            return command;
        }
    }

    /**
     * labels property
     */
    public readonly labelsProvider: SyncNodeProvider<Label, SyncLabel, LoadLabelsCommand>;


    /**
     * Specification for the componentinterfacesProvider
     */
    private static readonly componentInterfacesProviderSpecification: SyncNodeProviderSpecification<ComponentInterface, SyncComponentInterface, LoadComponentInterfacesCommand> = {
        createWrapper: componentinterface => new SyncComponentInterface(componentinterface),
        createCommand: modifiedSince => {
            const command = new LoadComponentInterfacesCommand(true);
            command.modifiedSince = modifiedSince;
            return command;
        }
    }

    /**
     * componentinterfaces property
     */
    public readonly componentInterfacesProvider: SyncNodeProvider<ComponentInterface, SyncComponentInterface, LoadComponentInterfacesCommand>;

    /**
     * Creates a new SyncComponent based on the provided component
     * @param node the underlaying node
     */
    public constructor(node: Component) {
        super(node);

        this.repositoryURLProperty = this.registerSyncModifiable(new SyncProperty(SyncComponent.repositoryURLPropertySpecification, this));
        this.issuesProvider = this.registerSyncModifiable(new SyncNodeProvider(SyncComponent.issuesProviderSpecification, node.issuesProperty));
        this.labelsProvider = this.registerSyncModifiable(new SyncNodeProvider(SyncComponent.labelsProviderSpecification, node.labelsProperty));
        this.componentInterfacesProvider = this.registerSyncModifiable(new SyncNodeProvider(SyncComponent.componentInterfacesProviderSpecification, node.consumedInterfacesProperty));
    }
}