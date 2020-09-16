import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { Issue } from "./Issue";
import { NamedOwnedNode } from "./NamedOwnedNode";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";

export const issuesOnLocationPropertyDescription: NodeListPropertySpecification<Issue, IssueLocation> 
    = NodeListPropertySpecification.loadDynamic<Issue, IssueLocation>(LoadRelationCommand.fromPrimary("issueLocation", "issue"),
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

export interface IssueLocation<T extends IssueLocation = any> extends NamedOwnedNode<T> {
    issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>;
}