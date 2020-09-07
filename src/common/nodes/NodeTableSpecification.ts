import { CCIMSNode } from "./CCIMSNode";

export class NodeTableSpecification<T extends CCIMSNode> {
    public readonly tableName: string;
    public readonly rows: RowSpecification<T>[];

    public constructor(tableName: string, baseNodeTableSpecification?: NodeTableSpecification<T>, ...rows: RowSpecification<T>[]) {
        this.tableName = tableName;
        this.rows = [...(baseNodeTableSpecification?.rows ?? []) , ...rows];
    }
}

export class RowSpecification<T extends CCIMSNode> {
    public readonly rowName: string;
    
    public readonly getValue: (node: T) => any;

    public constructor(rowName: string, getValue: (node: T) => any) {
        this.rowName = rowName;
        this.getValue = getValue;
    }

    public static fromProperty<T extends CCIMSNode, K extends keyof T>(rowName: string, property: K) {
        return new RowSpecification<T>(rowName, (node) => node[property]);
    }
}