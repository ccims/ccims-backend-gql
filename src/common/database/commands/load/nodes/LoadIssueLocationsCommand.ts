import { IssueLocation } from "../../../../nodes/IssueLocation";
import { ConditionSpecification } from "../ConditionSpecification";
import { LoadMultipleSyncNodeListsCommand } from "./LoadMultipleSyncNodeListsCommand";
import { createRelationFilterBySecundary } from "./RelationFilter";

/**
 * command to load IssueLocations
 */
export class LoadIssueLocationsCommand extends LoadMultipleSyncNodeListsCommand<IssueLocation> {

    /**
     * filters for IssueLocations where at least one of the issues is located
     */
    public hasIssueOnLocation: string[] | undefined;

    /**
     * Select only issue locations that match this regex
     */
    public name: string | undefined;

    /**
     * Select only issue locations that match this regex
     */
    public description: string | undefined;

    /**
     * Select only IssueLocations that were last updated after the given date (inclusive)
     */
    public lastUpdatedAfter: Date | undefined;

    /**
     * Select only IssueLocations that were last updated before the given date (inclusive)
     */
    public lastUpdatedBefore: Date | undefined;

    /**
     * creates a new LoadIssueLocationsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super("issue_location", loadDeleted);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.hasIssueOnLocation !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issue_location", "issue", this.hasIssueOnLocation, conditions.i));
            conditions.i++;
        }

        if (this.name !== undefined) {
            conditions.conditions.push({
                text: `main.name ~* $${conditions.i}`,
                values: [this.name],
                priority: 4
            });
            conditions.i++;
        }

        if (this.description !== undefined) {
            conditions.conditions.push({
                text: `main.description ~* $${conditions.i}`,
                values: [this.description],
                priority: 5
            });
            conditions.i++;
        }

        if (this.lastUpdatedAfter !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.last_updated_at>=$${conditions.i}`,
                values: [this.lastUpdatedAfter],
            });
            conditions.i++;
        }
        if (this.lastUpdatedBefore !== undefined) {
            conditions.conditions.push({
                priority: 5,
                text: `main.last_updated_at<=$${conditions.i}`,
                values: [this.lastUpdatedBefore],
            });
            conditions.i++;
        }

        return conditions;
    }
}