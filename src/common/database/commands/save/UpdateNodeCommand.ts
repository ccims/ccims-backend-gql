import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../../DatabaseManager";
import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { RowSpecification } from "../../../nodes/NodeTableSpecification";

export class UpdateNodeCommand<T extends CCIMSNode> extends DatabaseCommand<void> {

    public constructor (private readonly node: T, private readonly table: string, private readonly rows: RowSpecification<T>[]) {
        super();
    }

    public getQueryConfig(): QueryConfig<any[]> {
        const rowNames = this.rows.reduce((str, row, index) => `${str}${row.rowName}=$${index + 2}, `, "");
        return {
            text: `UPDATE ${this.table} SET ${rowNames.substr(0, rowNames.length - 2)} WHERE id=$1`,
            values: [this.node.id, ...this.rows.map(row => row.getValue(this.node))]
        };
    }
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }

}