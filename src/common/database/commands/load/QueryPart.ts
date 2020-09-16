/**
 * interface to specify partial sql statements
 */
export interface QueryPart {
    /**
     * the sql statement
     */
    text: string;
    /**
     * values for parameterized sql statement
     */
    values: any[];
}