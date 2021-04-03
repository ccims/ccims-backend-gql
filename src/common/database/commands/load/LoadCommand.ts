import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { QueryPart } from "./QueryPart";
import { ConditionSpecification } from "./ConditionSpecification";
import { DatabaseManager } from "../../DatabaseManager";

/**
 * abstraction to DatabaseCommand which is intended to load elements and therefore splits the query in three parts
 * start
 * conditions (where clause)
 * end
 * @param T the type to load
 */
export abstract class LoadCommand<T> extends DatabaseCommand<T> {
    /**
     * generates the query config out of generateQueryStart, generateConditions and
     * generateQueryEnd
     * the conditions are connected via AND, the whole command consists of begin + conditions + end;
     */
    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        const queryStart: QueryPart = this.generateQueryStart(databaseManager);
        let text: string = queryStart.text;
        const values: any[] = queryStart.values;

        const conditionSpecifications: ConditionSpecification[] = this.generateConditions(values.length + 1).conditions;
        for (const conditionSpecification of conditionSpecifications) {
            values.push(...conditionSpecification.values);
        }
        conditionSpecifications.sort((spec1, spec2) => spec1.priority - spec2.priority);
        const conditionsText = conditionSpecifications.map(spec => `(${spec.text})`).join(" AND ");
        if (conditionSpecifications.length > 0) {
            text += ` WHERE ${conditionsText} `;
        }

        const queryEnd: QueryPart = this.generateQueryEnd(values.length + 1);
        text += " " + queryEnd.text;
        values.push(...queryEnd.values);

        return {
            text,
            values
        }
    }

    /**
     * generate the start of the sql query
     * MUST select a table with the alias 'main'
     */
    protected abstract generateQueryStart(databaseManager: DatabaseManager): QueryPart

    /**
     * generate the end of the sql query
     * can use rows of a table called 'main'
     * default: ';'
     * @param i the first index of query parameter to use
     */
    protected generateQueryEnd(i: number): QueryPart {
        return {
            text: ";",
            values: []
        }
    }

    /**
     * generates the conditions for the sql statement
     * the conditions are ordered by priority, starting with the condition with the
     * lowest priority
     * the conditions are connected by AND
     * it is highly recommended to return at least one condition
     * @param i the first index of query parameter to use
     * @result the parameters and a new i
     */
    protected abstract generateConditions(i: number): { conditions: ConditionSpecification[], i: number }
}