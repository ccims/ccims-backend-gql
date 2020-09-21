import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { DatabaseManager } from "../../../common/database/DatabaseManager";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { log } from "../../../log";
import { PageInfo } from "./PageInfo";

/**
 * A page containing multipe CCIMS Nodes
 */
export class Page<TNode extends CCIMSNode> {

    /**
     * All nodes on this page
     */
    public readonly nodes: TNode[];

    /**
     * Edges with a cursor to the node
     */
    public readonly edges: { cursor: string, node: TNode }[];

    /**
     * Information about the current page
     */
    public readonly pageInfo: PageInfo;

    /**
     *
     * @param hasNext Weather there is another page with th current filter
     * @param hasPrev Weather there is a previous page with the current filter
     * @param nodes All nodes on this page
     * @param cmd The command used for getting the nodes. Needed for calculating totalCount when requested
     */
    public constructor(hasNext: boolean, hasPrev: boolean, nodes: TNode[],
        public readonly cmd: LoadNodeListCommand<TNode>, private readonly datbaseManager: DatabaseManager
    ) {
        // TODO: Calculate totalCound and hasNext/hasPrev for usage in page
        this.nodes = nodes.concat();
        this.edges = nodes.map(node => ({ cursor: node.id, node }));
        if (nodes.length > 0) {
            this.pageInfo = new PageInfo(hasNext, hasPrev, nodes[0].id, nodes[nodes.length - 1].id);
        } else {
            this.pageInfo = new PageInfo(false, false, undefined, undefined);
        }
    }

    /**
     * The total number of elements on the page; TODO: Add actual count; this is temporary
     */
    public async totalCount(): Promise<number> {
        this.cmd.countMode = true;
        this.datbaseManager.addCommand(this.cmd);
        await this.datbaseManager.executePendingCommands();
        this.cmd.countMode = false;
        if (this.cmd.count) {
            return this.cmd.count;
        } else {
            log(2, "command did not work as expected: countMode did not work");
            throw new Error("Internal server error");
        }
    }
}