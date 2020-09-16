import { QueryPart } from "./QueryPart";

/**
 * interface to specify a condition for a query
 */
export interface ConditionSpecification extends QueryPart {
    /**
     * the priority of the condition, conditions with lower priority are inserted first
     */
    priority: number;
}