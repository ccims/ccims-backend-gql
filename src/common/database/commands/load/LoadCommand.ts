import { DatabaseCommand } from "../../DatabaseCommand";
import { QueryConfig, QueryResult } from "pg";
import { NodeCache } from "../../NodeCache";
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
    public getQueryConfig(): QueryConfig<any[]> {
        const queryStart: QueryPart = this.generateQueryStart();
        let text: string = queryStart.text + " WHERE";
        let values: any[] = queryStart.values;

        const conditionSpecifications: ConditionSpecification[] = this.generateConditions(values.length + 1)[0];
        conditionSpecifications.sort((spec1, spec2) => spec1.priority - spec2.priority);

        for (let i = 0; i < conditionSpecifications.length - 1; i++) {
            text += `(${conditionSpecifications[i].text}) AND `;
            values.push(...conditionSpecifications[i].values);
        }
        if (conditionSpecifications.length > 0) {
            const i = conditionSpecifications.length - 1;
            text += `(${conditionSpecifications[i].text})`;
            values.push(...conditionSpecifications[i].values);
        }

        const queryEnd: QueryPart = this.generateQueryEnd(values.length + 1);
        text += queryEnd.text + " ";
        values.push(...queryEnd.values);

        return {
            text: text,
            values: values
        }
    }

    /**
     * generate the start of the sql query
     * MUST select a table with the alias 'main'
     */
    protected abstract generateQueryStart(): QueryPart

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
    protected abstract generateConditions(i: number): [ConditionSpecification[], number]

}