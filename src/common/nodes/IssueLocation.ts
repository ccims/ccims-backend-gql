import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { CCIMSNode } from "./CCIMSNode";
import { Issue } from "./Issue";
import { NamedNode } from "./NamedNode";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";

/**
 * interface which specifies what a IssueLocation is (a named node with the issuesOnLocationProperty)
 */
export interface IssueLocation<T extends IssueLocation = any> extends CCIMSNode<T> {
    issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>,
    description: string,
    name: string
}

/**
 * specification for the issuesOnLocationProperty (sadly interfaces cannot have a static property)
 */
export const issuesOnLocationPropertySpecification: NodeListPropertySpecification<Issue, IssueLocation>
    = NodeListPropertySpecification.loadDynamic<Issue, IssueLocation>(LoadRelationCommand.fromPrimary("issue_location", "issue"),
    (ids, issueLocation) => {
        const command = new LoadIssuesCommand();
        command.ids = ids;
        return command;
    },
    issueLocation => {
        const command = new LoadIssuesCommand();
        command.onLocations = [issueLocation.id];
        return command;
    })
    .notifyChanged((issue, issueLocation) => issue.locationsProperty)
    .saveOnPrimary("issue_location", "issue");
