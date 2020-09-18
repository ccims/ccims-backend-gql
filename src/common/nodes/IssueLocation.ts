import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { Issue } from "./Issue";
import { NamedNode } from "./NamedNode";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";

/**
 * interface which specifies what a IssueLocation is (a named node with the issuesOnLocationProperty)
 */
export interface IssueLocation<T extends IssueLocation = any> extends NamedNode<T> {
    issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>;
}

/**
 * specification for the issuesOnLocationProperty (sadly interfaces cannot have a static property)
 */
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
    .notifyChanged((issue, issueLocation) => issue.locationsProperty)
    .saveOnPrimary("issueLocation", "issue");
