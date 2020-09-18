import { verifyIsAllowedSqlIdent } from "../../SqlHelperFunctions";
import { ConditionSpecification } from "../ConditionSpecification";

/**
 * creates a filter which filters by primary or secundary
 * @param tableName the name of the relation table
 * @param primary the primary id column name
 * @param secundary the secundary id column name
 * @param filterByPrimary if true, primary is used for the filter and secundary is the result,
 *                        if false, secundary is used for the filter and primary is the result,
 * @param ids the ids to filter with
 * @param i the current values index
 * @returns the filter
 */
function createFilter(tableName: string, primary: string, secundary: string, filterByPrimary: boolean, ids: string[], i: number): ConditionSpecification {
    verifyIsAllowedSqlIdent(tableName);
    verifyIsAllowedSqlIdent(primary);
    verifyIsAllowedSqlIdent(secundary);

    if (ids.length == 1) {
        return {
            priority: 2,
            text: `main.id=ANY(SELECT ${filterByPrimary ? secundary : primary} FROM ${tableName} WHERE ${filterByPrimary ? primary : secundary}=$${i})`,
            values: [ids[0]]
        }
    } else {
        return {
            priority: 2,
            text: `main.id=ANY(SELECT ${filterByPrimary ? secundary : primary} FROM ${tableName} WHERE ${filterByPrimary ? primary : secundary}=ANY($${i}))`,
            values: [ids]
        }
    }

    
}

/**
 * creates a filter which filters by primary
 * when added, i should be increased by one
 * @param primary the primary id column name
 * @param secundary the secundary id column name
 * @param ids the ids to filter with
 * @param i the current values index
 * @returns the filter
 */
export function createRelationFilterByPrimary(primary: string, secundary: string, ids: string[], i: number): ConditionSpecification {
    return createFilter(`relation_${primary}_${secundary}`, primary, secundary, true, ids, i);
}

/**
 * creates a filter which filters by secundary
 * when added, i should be increased by one
 * @param primary the primary id column name
 * @param secundary the secundary id column name
 * @param ids the ids to filter with
 * @param i the current values index
 * @returns the filter
 */
export function createRelationFilterBySecundary(primary: string, secundary: string, ids: string[], i: number): ConditionSpecification {
    return createFilter(`relation_${primary}_${secundary}`, primary, secundary, false, ids, i);
}

/**
 * creates a filter which filters to select elements on one side
 * @param rowName the name of the row
 * @param ids the list of ids of the element on the many side
 * @param i the value index
 * @param priority the priority of the parameter, default 2
 * @returns the filter
 */
export function createRelationFilterOnOne(rowName: string, ids: string[], i: number, priority: number = 2): ConditionSpecification {
    verifyIsAllowedSqlIdent(rowName);
    if (ids.length == 1) {
        return { 
            priority: priority,
            text: `main.${rowName}=$${i}`,
            values: [ids[0]]
        };
    } else {
        return {
            priority: priority,
            text: `main.${rowName}=ANY($${i})`,
            values: [ids]
        };
    }
}

/**
 * creates a filter which filters to select elements on many side
 * @param tableName the name of the table on the one side
 * @param rowName the name of the row
 * @param ids the list of ids of the element on the one side
 * @param i the value index
 * @param priority the priority of the parameter, default 2
 * @returns the filter
 */
export function createRelationFilterOnMany(tableName: string, rowName: string, ids: string[], i: number, priority: number = 2): ConditionSpecification {
    verifyIsAllowedSqlIdent(tableName);
    verifyIsAllowedSqlIdent(rowName);
    if (ids.length == 1) {
        return {
            priority: priority,
            text: `main.id=ANY(SELECT ${rowName} FROM ${tableName} WHERE id=$${i})`,
            values: [ids[0]]
        };
    } else {
        return {
            priority: priority,
            text: `main.id=ANY(SELECT ${rowName} FROM ${tableName} WHERE id=ANY($${i}))`,
            values: [ids]
        };
    }
}

