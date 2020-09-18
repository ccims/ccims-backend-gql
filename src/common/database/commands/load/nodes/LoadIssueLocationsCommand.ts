import { IssueLocation } from "../../../../nodes/IssueLocation";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";
import { createRelationFilterBySecundary } from "./RelationFilter";

/**
 * command to load IssueLocations
 */
export class LoadIssueLocationsCommand extends LoadMultipleNodeListsCommand<IssueLocation> {

    /**
     * filters for IssueLocations where at least one of the issues is located
     */
    public hasIssueOnLocation?: string[];
    
    /**
     * creates a new LoadIssueLocationsCommand
     */
    public constructor() {
        super("issue_location");
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.hasIssueOnLocation) {
            conditions.conditions.push(createRelationFilterBySecundary("issueLocation", "issue", this.hasIssueOnLocation, conditions.i));
            conditions.i++;
        }
        
        return conditions;
    }
}