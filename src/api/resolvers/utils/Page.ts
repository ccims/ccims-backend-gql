import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { PageInfo } from "./PageInfo";
import node from "../query/node";

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
     * Creates a new page by creating edges
     * 
     * @param nodes The nodes on this page
     * @param pageInfo The information about this page
     * @param totalCount The total number of elements matching a filter
     */
    constructor(hasNext: boolean, hasPrev: boolean, nodes: TNode[],
        /**
         * The total number of nodes matching a filter
         */
        public readonly totalCount: number
    ) {
        this.nodes = nodes.concat();
        this.edges = nodes.map(node => ({ cursor: node.id, node }));
        if (nodes.length > 0) {
            this.pageInfo = new PageInfo(hasNext, hasPrev, nodes[0].id, nodes[nodes.length - 1].id);
        } else {
            this.pageInfo = new PageInfo(false, false, undefined, undefined);
        }
        this.totalCount = totalCount;
    }
}