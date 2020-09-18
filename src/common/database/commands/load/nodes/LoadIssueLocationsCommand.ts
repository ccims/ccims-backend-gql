import { IssueLocation } from "../../../../nodes/IssueLocation";
import { LoadMultipleNodeListsCommand } from "./LoadMultipleNodeListsCommand";

/**
 * command to load IssueLocations
 */
export class LoadIssueLocationsCommand extends LoadMultipleNodeListsCommand<IssueLocation> {
    
    /**
     * creates a new LoadIssueLocationsCommand
     */
    public constructor() {
        super("issue_location");
    }
}