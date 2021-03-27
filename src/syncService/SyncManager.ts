import { LoadIssuesCommand } from "../common/database/commands/load/nodes/LoadIssuesCommand";
import { Component } from "../common/nodes/Component";
import { Issue } from "../common/nodes/Issue";
import { ComponentSyncNodeProvider } from "./providers/ComponentManagerSyncNodeProvider";
import { SyncNodeProvider } from "./providers/SyncNodeProvider";
import { SyncNodeProviderSpecification } from "./providers/SyncNodeProviderSpecification";
import { SyncIssue } from "./nodes/SyncIssue";
import { SyncModifiableContainer } from "./SyncModifiableContainer";
import { Label } from "../common/nodes/Label";
import { SyncLabel } from "./nodes/SyncLabel";
import { LoadLabelsCommand } from "../common/database/commands/load/nodes/LoadLabelsCommand";
import { LoadComponentInterfacesCommand } from "../common/database/commands/load/nodes/LoadComponentInterfacesCommand";
import { ComponentInterface } from "../common/nodes/ComponentInterface";
import { SyncComponentInterface } from "./nodes/SyncComponentInterface";

/**
 * Class which provides nodes for sync
 */
export class SyncManager extends SyncModifiableContainer {

    /**
     * The component which is currently synced
     */
    private readonly _component: Component;

    /**
     * Specification for the issuesProvider
     */
    private static readonly issuesProviderSpecification: SyncNodeProviderSpecification<Issue, SyncIssue, LoadIssuesCommand> = {
        createWrapper: issue => new SyncIssue(issue),
        createCommand: modifiedSince => {
            const command = new LoadIssuesCommand();
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
            const command = new LoadLabelsCommand();
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
     private static readonly componentinterfacesProviderSpecification: SyncNodeProviderSpecification<ComponentInterface, SyncComponentInterface, LoadComponentInterfacesCommand> = {
        createWrapper: componentinterface => new SyncComponentInterface(componentinterface),
        createCommand: modifiedSince => {
            const command = new LoadComponentInterfacesCommand();
            command.modifiedSince = modifiedSince;
            return command;
        }
    }

    /**
     * componentinterfaces property
     */
    public readonly componentinterfacesProvider: SyncNodeProvider<ComponentInterface, SyncComponentInterface, LoadComponentInterfacesCommand>;


    /**
     * Creates a new SyncManager
     * @param component the component which is synced
     */
    public constructor(component: Component) {
        super();
        this._component = component;

        this.issuesProvider = this.registerSyncModifiable(new ComponentSyncNodeProvider(SyncManager.issuesProviderSpecification, component));
        this.labelsProvider = this.registerSyncModifiable(new ComponentSyncNodeProvider(SyncManager.labelsProviderSpecification, component));
        this.componentinterfacesProvider = this.registerSyncModifiable(new ComponentSyncNodeProvider(SyncManager.componentinterfacesProviderSpecification, component));
    }

    /**
     * Gets the component which is synced
     */
    public get component(): Component {
        return this._component;
    }
}