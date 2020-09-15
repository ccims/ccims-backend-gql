import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Issue } from "./Issue";
import { NamedOwnedNode, NamedOwnedNodeTableSpecification } from "./NamedOwnedNode";
import { NodeTableSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodesProperty } from "./properties/NodesProperty";
import { NodesPropertySpecification } from "./properties/NodesPropertySpecification";

export const IssueLocationTableSpecification: NodeTableSpecification<IssueLocation>
    = new NodeTableSpecification<IssueLocation>("node", NamedOwnedNodeTableSpecification);

export class IssueLocation<T extends IssueLocation = any> extends NamedOwnedNode<T> {
    public readonly issuesOnLocationProperty: NodesProperty<Issue, IssueLocation>;

    private static readonly issuesOnLocationPropertyDescription: NodesPropertySpecification<Issue, IssueLocation> 
        = NodesPropertySpecification.loadDynamic<Issue, IssueLocation>(LoadRelationCommand.fromPrimary("issueLocation", "issue"),
        (ids, issueLocation) => { 
            const command = undefined as any;
            command.ids = ids;
            return command;
        }, 
        issueLocation => {
            const command = undefined as any;
            command.onComponents = [issueLocation.id];
            return command;
        })
        //.notifyChanged((project, component) => project.componentsProperty)
        .saveOnPrimary("issueLocation", "issue");

    protected constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, name: string, description: string, ownerId: string) {
        super(type, databaseManager, tableSpecification, id, name, description, ownerId);
        this.issuesOnLocationProperty = this.registerSaveable(new NodesProperty<Issue, IssueLocation>(databaseManager, IssueLocation.issuesOnLocationPropertyDescription, this));
    }
}