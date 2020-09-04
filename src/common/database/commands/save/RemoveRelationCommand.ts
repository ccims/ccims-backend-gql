import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { NodeCache } from "../../NodeCache";
import { CCIMSNode } from "../../../nodes/CCIMSNode";

export class RemoveRelationCommand extends DatabaseCommand<void> {

    private readonly config: QueryConfig<any[]>;

    /**
     * Command to add a relation
     * WARNING: only primaryId and secundaryId are secured agains sql injections,
     * DO NOT use user input for tableName, primary or secundary
     * @param tableName the name of the relation table
     * @param primary the name for the primary column
     * @param secundary the name for the secundary column
     * @param primaryId the value to insert for the primary
     * @param secundaryId the value to insert for secundary
     */
    public constructor(tableName: string, primary: string, secundary: string, primaryId: string, secundaryId: string) {
        super();
        this.config = {
            text: `DELETE FROM ${tableName} WHERE (${primary}, ${secundary}) = ($1, $2);`,
            values: [primaryId, secundaryId]
        }
    }

    public getQueryConfig(): QueryConfig<any[]> {
        return this.config;
    }

    protected getResultInternal(nodeCache: NodeCache, result: QueryResult<any>): void {
        //no nothing
    }

   /**
     * creates a generator for a RemoveRelationCommand for properties on the primary node
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     */
    public static fromPrimary(primary: string, secundary: string): (id: string, node: CCIMSNode) => RemoveRelationCommand {
        return (id, node) => new RemoveRelationCommand(`relation_${primary}, ${secundary}`, primary + "_id", secundary + "_id", node.id, id);
    }

    /**
     * creates a generator for a RemoveRelationCommand for properties on the secundary node
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     */
    public static fromSecundary(primary: string, secundary: string): (id: string, node: CCIMSNode) => RemoveRelationCommand {
        return (id, node) => new RemoveRelationCommand(`relation_${primary}, ${secundary}`, primary + "_id", secundary + "_id", node.id, id);
    }
}