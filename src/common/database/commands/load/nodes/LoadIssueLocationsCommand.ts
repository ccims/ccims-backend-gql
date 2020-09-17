import { IssueLocation } from "../../../../nodes/IssueLocation";
import { LoadNodesCommand } from "./LoadNodesCommand";

/**
 * command to load IssueLocations
 */
export class LoadIssueLocationsCommand extends LoadNodesCommand<IssueLocation> {
    
    public constructor() {
        super("issue_location", "id");
    }
}