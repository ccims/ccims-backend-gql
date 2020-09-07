import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { DatabaseManager } from "../../DatabaseManager";
import { RowSpecification } from "../../../nodes/NodeTableSpecification";

export class AddNodeCommand<T extends CCIMSNode> extends DatabaseCommand<void> {
    public constructor (private readonly node: T, private readonly table: string, private readonly rows: RowSpecification<T>[]) {
        super();
    }

    public getQueryConfig(): QueryConfig<any[]> {
        const rowNames = this.rows.map(row => row.rowName).join(", ");
        const numbers = this.rows.map((row, index) => `$${index + 1}`).join(", ");
        return {
            text: `INSERT INTO ${this.table} (${rowNames}) VALUES (${numbers})`,
            values: this.rows.map(row => row.getValue(this.node))
        };
    }
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }
}