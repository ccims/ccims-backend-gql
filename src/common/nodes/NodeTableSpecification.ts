import { CCIMSNode } from "./CCIMSNode";

/**
 * specification of a table in which nodes of type T are saved
 * must not be complete
 * @param T the type of CCIMSNode in the table
 */
export class NodeTableSpecification<T extends CCIMSNode> {
    /**
     * the name of the table
     */
    public readonly tableName: string;
    /**
     * the rows of the table
     */
    public readonly rows: RowSpecification<T>[];

    /**
     * creates a new NodeTableSpecification with all rows of baseNodeTableSpecification and rows
     * @param tableName the name of the table
     * @param baseNodeTableSpecification the table specification which is the base of this table specification
     * @param rows the rows to add to baseNodeTableSpecification
     */
    public constructor(tableName: string, baseNodeTableSpecification?: NodeTableSpecification<T>, ...rows: RowSpecification<T>[]) {
        this.tableName = tableName;
        this.rows = [...(baseNodeTableSpecification?.rows ?? []) , ...rows];
    }
}

/**
 * specifies a row in the table
 * @param T the type of CCIMSNode which is in the table which contains this row
 */
export class RowSpecification<T extends CCIMSNode> {
    /**
     * the name of the row
     */
    public readonly rowName: string;

    /**
     * function to get the value from the node
     */
    public readonly getValue: (node: T) => any;

    /**
     * creates a new RowSpecification
     * @param rowName the name of the row
     * @param getValue function to get the value from the row
     */
    public constructor(rowName: string, getValue: (node: T) => any) {
        this.rowName = rowName;
        this.getValue = getValue;
    }

    /**
     * creates a new RowSpecification which returns the property from the node
     * @param rowName the name of the row
     * @param property the name of the property, must be a property on T
     * @param T the type of node
     * @param K IGNORE! guarantees that property is a correct property a type which represents an array of strings which are the names of the proerties on T
     */
    public static fromProperty<T extends CCIMSNode, K extends keyof T>(rowName: string, property: K) {
        return new RowSpecification<T>(rowName, (node) => node[property]);
    }
}