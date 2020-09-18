import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { CCIMSNode } from "../../../nodes/CCIMSNode";
import { DatabaseManager } from "../../DatabaseManager";
import { verifyIsAllowedSqlIdent } from "../SqlHelperFunctions";

/**
 * command to add a relation to the database
 */
export class AddRelationCommand extends DatabaseCommand<void> {

    /**
     * the query
     */
    private readonly config: QueryConfig<any[]>;

    /**
     * Command to add a relation
     * DO NOT use user input for tableName, primary or secundary
     * @param tableName the name of the relation table
     * @param primary the name for the primary column
     * @param secundary the name for the secundary column
     * @param primaryId the value to insert for the primary
     * @param secundaryId the value to insert for secundary
     */
    public constructor(tableName: string, primary: string, secundary: string, primaryId: string, secundaryId: string) {
        super();
        verifyIsAllowedSqlIdent(tableName);
        verifyIsAllowedSqlIdent(primary);
        verifyIsAllowedSqlIdent(secundary);
        this.config = {
            text: `INSERT INTO ${tableName} (${primary}, ${secundary}) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
            values: [primaryId, secundaryId]
        }
    }

    /**
     * generates the command
     */
    public getQueryConfig(): QueryConfig<any[]> {
        return this.config;
    }

    /**
     * called when the query is finished
     * does nothing
     * @param databaseManager the databaseManager
     * @param result the result from the query
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        return [];
    }

   /**
     * creates a generator for a AddRelationCommand for properties on the primary node
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     */
    public static fromPrimary(primary: string, secundary: string): (id: string, node: CCIMSNode) => AddRelationCommand {
        return (id, node) => new AddRelationCommand(`relation_${primary}_${secundary}`, primary + "_id", secundary + "_id", node.id, id);
    }

    /**
     * creates a generator for a AddRelationCommand for properties on the secundary node
     * @param primary the primary id column name
     * @param secundary the secundary id column name
     */
    public static fromSecundary(primary: string, secundary: string): (id: string, node: CCIMSNode) => AddRelationCommand {
        return (id, node) => new AddRelationCommand(`relation_${primary}_${secundary}`, primary + "_id", secundary + "_id", node.id, id);
    }
}