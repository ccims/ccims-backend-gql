import { LoadComponentInterfacesCommand } from "../../common/database/commands/load/nodes/LoadComponentInterfacesCommand";
import { LoadIssuesCommand } from "../../common/database/commands/load/nodes/LoadIssuesCommand";
import { LoadLabelsCommand } from "../../common/database/commands/load/nodes/LoadLabelsCommand";
import { Component } from "../../common/nodes/Component";
import { ComponentInterface } from "../../common/nodes/ComponentInterface";
import { Issue } from "../../common/nodes/Issue";
import { Label } from "../../common/nodes/Label";
import { SyncNodeProvider } from "../providers/SyncNodeProvider";
import { SyncNodeProviderSpecification } from "../providers/SyncNodeProviderSpecification";
import { SyncComponentInterface } from "./SyncComponentInterface";
import { SyncIssue } from "./SyncIssue";
import { SyncLabel } from "./SyncLabel";
import { SyncNodeWrapper } from "./SyncNodeWrapper";

/**
 * Sync wrapper for Label
 */
 export class SyncComponent extends SyncNodeWrapper<Component> {

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
     * Creates a new SyncComponent based on the provided component
     * @param node the underlaying node
     */
    public constructor(node: Component) {
        super(node);

        this.issuesProvider = this.registerSyncModifiable(new SyncNodeProvider(SyncComponent.issuesProviderSpecification, node.issuesProperty));
        this.labelsProvider = this.registerSyncModifiable(new SyncNodeProvider(SyncComponent.labelsProviderSpecification, node.labelsProperty));
        this.componentinterfacesProvider = this.registerSyncModifiable(new SyncNodeProvider(SyncComponent.componentinterfacesProviderSpecification, node.consumedInterfacesProperty));
    }
}