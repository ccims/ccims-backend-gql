import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { PageInfo } from "./PageInfo";
import node from "../query/node";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { DatabaseManager } from "../../../common/database/DatabaseManager";

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
        public readonly cmd: LoadNodeListCommand<TNode>
    ) {
        //TODO: Calculate totalCound and hasNext/hasPrev for usage in page
        this.nodes = nodes.concat();
        this.edges = nodes.map(node => ({ cursor: node.id, node }));
        if (nodes.length > 0) {
            this.pageInfo = new PageInfo(hasNext, hasPrev, nodes[0].id, nodes[nodes.length - 1].id);
        } else {
            this.pageInfo = new PageInfo(false, false, undefined, undefined);
        }
    }
}