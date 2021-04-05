import { QueryResultRow, QueryResult } from "pg";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadUsersCommandBase } from "./LoadUsersCommandBase";
import { createStringListFilter } from "./RelationFilter";
import { IMSUser, IMSUserTableSpecification } from "../../../../nodes/IMSUser";

/**
 * command to load a list of ims users
 */
export class LoadIMSUsersCommand extends LoadUsersCommandBase<IMSUser> {

    /**
     * select onlsy IMSUsers that have one of the specified issues
     */
    public imsSystems?: string[];

    /**
     * creates a new LoadUsersCommand
     */
    public constructor() {
        super(IMSUserTableSpecification.rows);
    }

    /**
     * Parses a user loaded from the database
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed user
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): IMSUser {
        return new IMSUser(databaseManager, resultRow.id, resultRow.linked_user_id, resultRow.username, resultRow.displayname, resultRow.ims_id, resultRow.email, resultRow.ims_data);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("ims_user", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.imsSystems !== undefined) {
            conditions.conditions.push(createStringListFilter("ims_id", this.imsSystems, conditions.i, 3));
            conditions.i++;
        }

        return conditions;
    }
}