import { QueryPart } from "./QueryPart";

export interface ConditionSpecification extends QueryPart {
    /**
     * the priority of the condition, conditions with lower priority are inserted first
     */
    priority: number;
}